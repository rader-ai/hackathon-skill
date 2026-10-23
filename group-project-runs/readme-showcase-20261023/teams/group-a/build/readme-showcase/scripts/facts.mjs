#!/usr/bin/env node
// facts.mjs - deterministic fact extraction from a repository. Node >= 18, no dependencies.
// Usage: node facts.mjs <repo-dir> [--out facts.json]
// READ-ONLY on <repo-dir>: it never writes there. Without --out the JSON goes to stdout.
// Parses: Python argparse CLIs (subcommands, flags), pyproject/setup python floor, package.json,
// Makefile targets, license, committed output files, tests, imports (stdlib-only / network), CI, URLs.
// Everything it cannot parse is listed in `unparsed` - never silently skipped. Exit 2 on bad input.
import fs from 'node:fs';
import path from 'node:path';

const SKIP_DIRS = new Set(['.git', 'node_modules', '.venv', 'venv', '__pycache__', 'dist', 'build', '.tox', '.mypy_cache', '.next', 'target', '.readme-showcase']);
const MAX_FILES = 3000;
const PY_STDLIB = new Set(`abc argparse array ast asyncio atexit base64 bisect builtins bz2 calendar cgi cmath cmd codecs collections colorsys concurrent configparser contextlib copy csv ctypes dataclasses datetime decimal difflib dis email enum errno fcntl filecmp fnmatch fractions ftplib functools gc getopt getpass gettext glob gzip hashlib heapq hmac html http imaplib importlib inspect io ipaddress itertools json keyword linecache locale logging lzma mailbox math mimetypes multiprocessing numbers operator os pathlib pickle pkgutil platform plistlib pprint queue random re readline reprlib resource sched secrets select selectors shelve shlex shutil signal site smtplib socket sqlite3 ssl stat statistics string struct subprocess sys sysconfig tarfile tempfile textwrap threading time timeit tkinter token tokenize traceback types typing unicodedata unittest urllib uuid venv warnings weakref webbrowser xml zipfile zlib zoneinfo __future__ tomllib`.split(/\s+/));
const NET_MODS = new Set(['socket', 'urllib', 'http', 'ftplib', 'smtplib', 'imaplib', 'requests', 'httpx', 'aiohttp', 'urllib3', 'websockets', 'ssl']);
const OUT_EXT = new Set(['.html', '.png', '.svg', '.gif', '.jpg', '.jpeg', '.webp', '.pdf']);

export class InputError extends Error {}

function read(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }

function walk(root) {
  const files = [];
  const stack = [''];
  while (stack.length) {
    const rel = stack.pop();
    let entries;
    try { entries = fs.readdirSync(path.join(root, rel), { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) stack.push(r); }
      else if (e.isFile()) {
        files.push({ path: r, bytes: fs.statSync(path.join(root, r)).size });
        if (files.length >= MAX_FILES) return { files, truncated: true };
      }
    }
  }
  files.sort((a, b) => a.path.localeCompare(b.path));
  return { files, truncated: false };
}

function gitignoreMatcher(root) {
  const txt = read(path.join(root, '.gitignore')) || '';
  const pats = txt.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#') && !l.startsWith('!'));
  const res = pats.map((p) => {
    const dirOnly = p.endsWith('/');
    let core = p.replace(/^\//, '').replace(/\/$/, '');
    const anchored = p.startsWith('/') || core.includes('/');
    const re = core.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]').replace(/\u0000/g, '.*');
    const full = anchored ? `^${re}(/.*)?$` : `(^|/)${re}(/.*)?$`;
    return { re: new RegExp(full), dirOnly };
  });
  return (rel) => res.some(({ re, dirOnly }) => re.test(dirOnly ? rel.replace(/[^/]+$/, (m) => m) : rel) && (!dirOnly || rel.includes('/')));
}

const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;

function parseArgparse(file, text, out) {
  // Sequential scan: a variable bound by `x = <something>.add_parser("name")` owns the add_argument calls
  // that follow it until it is rebound. Variables never bound belong to the root parser (sub = null).
  const rel = file;
  const lines = text.split('\n');
  const owner = {};
  for (let i = 0; i < lines.length; i++) {
    const ap = /(?:(\w+)\s*=\s*)?[\w.]+\.add_parser\(\s*["']([\w-]+)["']/.exec(lines[i]);
    if (ap) {
      out.subcommands.push({ name: ap[2], file: rel, line: i + 1 });
      if (ap[1]) owner[ap[1]] = ap[2];
      continue;
    }
    const mm = /(\w+)\.add_argument\(/.exec(lines[i]);
    if (!mm) continue;
    let call = lines[i].slice(mm.index);
    for (let j = i; (call.split('(').length - call.split(')').length) > 0 && j < lines.length - 1 && j - i < 6; j++) call += ' ' + lines[j + 1].trim();
    const sub = owner[mm[1]] ?? null;
    const strs = [...call.matchAll(/["']([^"']*)["']/g)].map((x) => x[1]);
    const required = /required\s*=\s*True/.test(call);
    const dashed = strs.filter((s) => /^-{1,2}[A-Za-z]/.test(s));
    const dyn = /add_argument\(\s*["']--["']\s*\+\s*(\w+)/.exec(call);
    if (dyn) {
      const loop = new RegExp(`for\\s+${dyn[1]}\\s+in\\s+[\\(\\[]([^\\)\\]]*)[\\)\\]]`).exec(lines.slice(Math.max(0, i - 3), i + 1).join('\n'));
      if (loop) for (const s of [...loop[1].matchAll(/["']([\w-]+)["']/g)].map((x) => x[1])) out.flags.push({ sub, flag: '--' + s, required, file: rel, line: i + 1 });
      else out.unparsed.push(`argparse flag built dynamically at ${rel}:${i + 1} (flag names not extracted)`);
    } else if (dashed.length) {
      for (const f of dashed) out.flags.push({ sub, flag: f, required, file: rel, line: i + 1 });
    } else if (strs.length && /^[A-Za-z_][\w-]*$/.test(strs[0])) {
      out.positionals.push({ sub, name: strs[0], file: rel, line: i + 1 });
    }
  }
}

function parsePyImports(text) {
  const mods = new Set();
  for (const m of text.matchAll(/^\s*import\s+([\w., ]+)/gm)) for (const p of m[1].split(',')) mods.add(p.trim().split(/\s+as\s+/)[0].split('.')[0]);
  for (const m of text.matchAll(/^\s*from\s+([\w.]+)\s+import\s/gm)) if (!m[1].startsWith('.')) mods.add(m[1].split('.')[0]);
  return mods;
}

function licenseType(txt) {
  if (!txt) return null;
  const t = txt.slice(0, 4000);
  if (/Permission is hereby granted, free of charge/i.test(t)) return 'MIT';
  if (/Apache License/i.test(t) && /Version 2\.0/i.test(t)) return 'Apache-2.0';
  if (/GNU AFFERO/i.test(t)) return 'AGPL';
  if (/GNU LESSER/i.test(t)) return 'LGPL';
  if (/GNU GENERAL PUBLIC LICENSE/i.test(t)) return /Version 3/i.test(t) ? 'GPL-3.0' : 'GPL';
  if (/Mozilla Public License/i.test(t)) return 'MPL-2.0';
  if (/ISC License|Permission to use, copy, modify, and\/or distribute/i.test(t)) return 'ISC';
  if (/Redistribution and use in source and binary forms/i.test(t)) return /Neither the name/i.test(t) ? 'BSD-3-Clause' : 'BSD-2-Clause';
  if (/This is free and unencumbered software/i.test(t)) return 'Unlicense';
  return 'unknown';
}

export function extractFacts(repoArg) {
  if (!repoArg) throw new InputError('no repo directory given');
  const root = path.resolve(repoArg);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new InputError(`repo directory not found: ${root}`);
  const { files, truncated } = walk(root);
  if (!files.length) throw new InputError(`repo directory is empty (no files found): ${root}`);
  const ignored = gitignoreMatcher(root);
  for (const f of files) f.ignored = ignored(f.path);
  const F = {
    schema: 1, repo: root, repo_name: path.basename(root),
    parsed: [], unparsed: [], notes: [],
    files, files_truncated: truncated,
    readme: null, license: null, python: null, node: null,
    entrypoints: [], subcommands: [], flags: [], positionals: [], commands: [],
    npm: null, make_targets: [], outputs: [], tests: { dirs: [], files: [], framework_hint: null },
    imports: { stdlib_only: null, third_party: [], network: [], external_tools: [] },
    ci_workflows: [], urls: [], docs: [], prompts_or_data: [],
  };
  const has = (p) => files.some((f) => f.path === p);
  const pyFiles = files.filter((f) => f.path.endsWith('.py'));
  const jsFiles = files.filter((f) => /\.(m?js|cjs|ts|tsx)$/.test(f.path));

  // README / docs / license
  const readme = files.find((f) => /^readme(\.[a-z]+)?$/i.test(f.path));
  if (readme) { const t = read(path.join(root, readme.path)) || ''; const h1 = /^#\s+(.+)$/m.exec(t); F.readme = { path: readme.path, title: h1 ? h1[1].trim() : null, bytes: readme.bytes }; for (const m of t.matchAll(/https?:\/\/[^\s)>\]"'`]+/g)) F.urls.push(m[0].replace(/[.,;]+$/, '')); const pv = /Python\s+(\d+(?:\.\d+)+)/i.exec(t); if (pv) F.python = { floor: null, floor_source: null, documented: pv[1], documented_source: `${readme.path} (the repo's own README, not a manifest)` }; }
  else F.notes.push('No README found in repo root.');
  F.docs = files.filter((f) => /\.(md|rst|txt)$/i.test(f.path) && !/^readme/i.test(f.path) && !/^license/i.test(f.path)).map((f) => f.path);
  F.prompts_or_data = files.filter((f) => /(^|\/)(prompts|examples|fixtures|samples|data)\//.test(f.path)).map((f) => f.path);
  const lic = files.find((f) => /^(license|licence|copying)(\.[a-z]+)?$/i.test(f.path));
  if (lic) F.license = { file: lic.path, type: licenseType(read(path.join(root, lic.path))), source: 'license file' };
  F.parsed.push('files', 'readme', 'license', 'gitignore');

  // Python
  if (pyFiles.length) {
    F.parsed.push('python');
    const pyproject = read(path.join(root, 'pyproject.toml'));
    const setup = read(path.join(root, 'setup.py')) || read(path.join(root, 'setup.cfg'));
    let floor = null, src = null;
    if (pyproject) { const m = /requires-python\s*=\s*["']([^"']+)["']/.exec(pyproject); if (m) { floor = m[1]; src = 'pyproject.toml requires-python'; } }
    if (!floor && setup) { const m = /python_requires\s*=\s*["']?([^"'\n]+)/.exec(setup); if (m) { floor = m[1].trim(); src = 'setup python_requires'; } }
    if (!floor) { const pvf = read(path.join(root, '.python-version')); if (pvf) { floor = pvf.trim(); src = '.python-version'; } }
    const clean = floor ? (/(\d+\.\d+)/.exec(floor) || [])[1] || floor : null;
    F.python = { ...(F.python || {}), floor: clean, floor_raw: floor, floor_source: src, documented: F.python?.documented ?? null, documented_source: F.python?.documented_source ?? null };
    if (!floor) F.notes.push('No machine-readable Python floor (pyproject/setup/.python-version). Any Python version in the README must be pinned to a documented source in the ledger.');
    if (pyproject) {
      F.parsed.push('pyproject');
      for (const m of pyproject.matchAll(/^\s*([\w.-]+)\s*=\s*["']([\w.:]+)["']\s*$/gm)) { /* scripts section handled below */ void m; }
      const sec = /\[project\.scripts\]([\s\S]*?)(?:\n\[|$)/.exec(pyproject);
      if (sec) for (const m of sec[1].matchAll(/^\s*([\w.-]+)\s*=/gm)) F.commands.push({ cmd: m[1], source: 'pyproject [project.scripts]' });
      const nm = /^\s*name\s*=\s*["']([^"']+)["']/m.exec(pyproject); if (nm) F.python.package_name = nm[1];
      for (const m of pyproject.matchAll(/https?:\/\/[^\s"']+/g)) F.urls.push(m[0]);
    }
    const imports = new Set(); const localMods = new Set(pyFiles.map((f) => path.basename(f.path, '.py')).concat(files.filter((f) => f.path.endsWith('/__init__.py')).map((f) => f.path.split('/').slice(-2)[0])));
    const tools = new Set();
    for (const f of pyFiles) {
      const text = read(path.join(root, f.path)) || '';
      for (const mod of parsePyImports(text)) imports.add(mod);
      if (/argparse/.test(text)) {
        const before = F.subcommands.length;
        parseArgparse(f.path, text, F);
        const isMain = /if\s+__name__\s*==\s*["']__main__["']/.test(text);
        if (isMain || F.subcommands.length > before || /ArgumentParser\(/.test(text)) F.entrypoints.push({ file: f.path, kind: 'python-argparse', main_guard: isMain });
      } else if (/^\s*(import|from)\s+(click|typer|fire|docopt)\b/m.test(text)) {
        F.unparsed.push(`${f.path}: click/typer/fire/docopt CLI detected but not parsed; commands and flags there are not auto-verified`);
        F.entrypoints.push({ file: f.path, kind: 'python-unparsed-cli', main_guard: false });
      }
      for (const m of text.matchAll(/subprocess\.(?:run|check_call|check_output|Popen)\(\s*\[\s*["']([\w.-]+)["']/g)) tools.add(m[1]);
      for (const m of text.matchAll(/shutil\.which\(\s*["']([\w.-]+)["']/g)) tools.add(m[1]);
      for (const m of text.matchAll(/for\s+tool\s+in\s+\(([^)]*)\)/g)) for (const s of m[1].matchAll(/["']([\w.-]+)["']/g)) tools.add(s[1]);
    }
    const third = [...imports].filter((m) => !PY_STDLIB.has(m) && !localMods.has(m)).sort();
    F.imports.third_party = third;
    F.imports.network = [...imports].filter((m) => NET_MODS.has(m)).sort();
    F.imports.stdlib_only = third.length === 0;
    F.imports.external_tools = [...tools].sort();
    if (!F.entrypoints.length) F.notes.push('Python files found but no argparse/click entrypoint detected; commands must come from existing docs and be pinned in the ledger.');
    // Python commands from argparse
    for (const e of F.entrypoints.filter((x) => x.kind === 'python-argparse')) {
      const subs = F.subcommands.filter((s) => s.file === e.file);
      if (subs.length) for (const s of subs) F.commands.push({ cmd: `python3 ${e.file} ${s.name}`, source: `${s.file}:${s.line} add_parser`, entry: e.file, sub: s.name });
      else F.commands.push({ cmd: `python3 ${e.file}`, source: e.file, entry: e.file, sub: null });
    }
    // tests
    const testFiles = pyFiles.filter((f) => /(^|\/)(test_[^/]*|[^/]*_test)\.py$/.test(f.path));
    if (testFiles.length) {
      F.tests.files.push(...testFiles.map((f) => f.path));
      const t0 = read(path.join(root, testFiles[0].path)) || '';
      F.tests.framework_hint = /import\s+pytest|from\s+pytest/.test(t0) ? 'pytest' : /unittest/.test(t0) ? 'unittest' : 'unknown';
    }
  }

  // Node
  const pkgText = read(path.join(root, 'package.json'));
  if (pkgText) {
    let pkg;
    try { pkg = JSON.parse(pkgText); } catch (e) { throw new InputError(`package.json is not valid JSON: ${e.message}`); }
    F.parsed.push('package.json');
    const bin = typeof pkg.bin === 'string' ? { [pkg.name]: pkg.bin } : pkg.bin || {};
    F.npm = { name: pkg.name ?? null, version: pkg.version ?? null, private: !!pkg.private, main: pkg.main ?? null, type: pkg.type ?? null,
      scripts: pkg.scripts || {}, bin, engines: pkg.engines || {}, dependencies: Object.keys(pkg.dependencies || {}), devDependencies: Object.keys(pkg.devDependencies || {}), license: pkg.license ?? null };
    F.node = { floor: (pkg.engines?.node && (/(\d+)/.exec(pkg.engines.node) || [])[1]) || null, floor_raw: pkg.engines?.node ?? null };
    for (const s of Object.keys(F.npm.scripts)) F.commands.push({ cmd: s === 'test' ? 'npm test' : `npm run ${s}`, source: `package.json scripts.${s}`, npm_script: s });
    for (const b of Object.keys(bin)) F.commands.push({ cmd: b, source: 'package.json bin' });
    if (F.npm.license && !F.license) F.license = { file: null, type: F.npm.license, source: 'package.json' };
    for (const k of ['homepage']) if (pkg[k]) F.urls.push(pkg[k]);
    if (pkg.repository) F.urls.push(typeof pkg.repository === 'string' ? pkg.repository : pkg.repository.url);
    if (/\b(jest|mocha|vitest|node --test|ava|tap)\b/.test(Object.values(F.npm.scripts).join(' ') + (F.npm.devDependencies || []).join(' '))) F.tests.framework_hint = F.tests.framework_hint || 'js-test-runner';
    if (/commander|yargs|minimist|meow|oclif|cac/.test([...F.npm.dependencies].join(' ')) || (Object.keys(bin).length && !pyFiles.length)) F.unparsed.push('JavaScript CLI argument parsing (commander/yargs/bin) is not parsed; flags and subcommands there are not auto-verified');
    const jt = jsFiles.filter((f) => /(\.test\.|\.spec\.|(^|\/)tests?\/)/.test(f.path));
    F.tests.files.push(...jt.map((f) => f.path));
  } else if (jsFiles.length) {
    F.unparsed.push('JavaScript/TypeScript sources found but no package.json; no scripts or engines to read');
  }

  // Makefile
  const mk = read(path.join(root, 'Makefile'));
  if (mk) { F.parsed.push('Makefile'); for (const m of mk.matchAll(/^([A-Za-z0-9_.-]+)\s*:(?!=)/gm)) if (!m[1].startsWith('.')) { F.make_targets.push(m[1]); F.commands.push({ cmd: `make ${m[1]}`, source: 'Makefile' }); } }

  // Other ecosystems: present, not parsed
  for (const [f, label] of [['Cargo.toml', 'Rust (Cargo)'], ['go.mod', 'Go modules'], ['pom.xml', 'Maven'], ['build.gradle', 'Gradle'], ['Gemfile', 'Ruby (Bundler)'], ['composer.json', 'PHP (Composer)'], ['mix.exs', 'Elixir'], ['Package.swift', 'Swift PM'], ['CMakeLists.txt', 'CMake']])
    if (has(f)) F.unparsed.push(`${label}: ${f} present but not parsed; every command, flag and version from it must be pinned by hand in the ledger`);
  const csproj = files.find((f) => f.path.endsWith('.csproj')); if (csproj) F.unparsed.push(`.NET: ${csproj.path} present but not parsed`);
  const shFiles = files.filter((f) => /\.(sh|bash)$/.test(f.path));
  if (shFiles.length) F.unparsed.push(`shell scripts present (${shFiles.slice(0, 5).map((f) => f.path).join(', ')}); usage/flags in them are not parsed`);
  const other = files.filter((f) => /\.(go|rs|java|rb|php|c|cc|cpp|swift|kt|cs)$/.test(f.path));
  if (other.length && !F.unparsed.some((u) => /not parsed/.test(u))) F.unparsed.push(`source files in unparsed languages (${[...new Set(other.map((f) => path.extname(f.path)))].join(' ')}); nothing about them is auto-verified`);

  // Outputs (images/html), CI
  F.outputs = files.filter((f) => OUT_EXT.has(path.extname(f.path).toLowerCase())).map((f) => ({ path: f.path, bytes: f.bytes, kind: path.extname(f.path).slice(1).toLowerCase(), gitignored: f.ignored, committed_candidate: !f.ignored }));
  F.ci_workflows = files.filter((f) => /^\.github\/workflows\/.+\.ya?ml$/.test(f.path)).map((f) => f.path);
  if (!F.ci_workflows.length) F.notes.push('No .github/workflows found: no CI badge can be claimed.');
  F.tests.dirs = [...new Set(files.map((f) => f.path.split('/')[0]).filter((d, i, a) => /^(tests?|__tests__|spec)$/.test(d)))];
  const gitCfg = read(path.join(root, '.git', 'config'));
  if (gitCfg) for (const m of gitCfg.matchAll(/url\s*=\s*(\S+)/g)) F.urls.push(m[1]);
  F.urls = [...new Set(F.urls.filter(Boolean))];
  if (!F.commands.length) F.notes.push('No commands extracted automatically; every command in the README must come from existing docs and be pinned in the ledger with a quote.');
  return F;
}

if (process.argv[1] && process.argv[1].endsWith('facts.mjs')) {
  const args = process.argv.slice(2);
  const oi = args.indexOf('--out');
  const out = oi > -1 ? args[oi + 1] : null;
  if (oi > -1 && !out) { console.error('facts: --out needs a path'); process.exit(2); }
  const repo = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--out');
  try {
    const F = extractFacts(repo);
    const json = JSON.stringify(F, null, 2) + '\n';
    if (out) {
      const outAbs = path.resolve(out);
      if (outAbs.startsWith(F.repo + path.sep) && !outAbs.startsWith(path.join(F.repo, '.readme-showcase') + path.sep)) {
        console.error(`facts: refusing to write inside the repo outside .readme-showcase/: ${outAbs}`); process.exit(2);
      }
      fs.mkdirSync(path.dirname(outAbs), { recursive: true });
      fs.writeFileSync(outAbs, json);
      console.error(`facts: wrote ${outAbs}`);
    } else process.stdout.write(json);
    console.error(`facts: ${F.files.length} files; parsed: ${F.parsed.join(', ')}; commands: ${F.commands.length}; flags: ${F.flags.length}; unparsed notes: ${F.unparsed.length}`);
    for (const u of F.unparsed) console.error(`facts: NOTE unparsed - ${u}`);
  } catch (e) {
    if (e instanceof InputError) { console.error(`facts: ${e.message}\nUsage: node facts.mjs <repo-dir> [--out facts.json]`); process.exit(2); }
    throw e;
  }
}
