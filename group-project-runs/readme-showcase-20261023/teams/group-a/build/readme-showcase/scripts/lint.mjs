#!/usr/bin/env node
// lint.mjs - the truth gate. Checks a drafted README against the claim ledger and extracted facts.
// Usage: node lint.mjs <readme.md> <claims.json> <facts.json> [--repo DIR] [--link-base readme|repo] [--json]
//   --repo       repo root for evidence files (default: facts.repo)
//   --readme-final-dir  folder the README will finally live in. Images resolve there (so a draft in $OUT needs no symlink).
//   --link-base  how relative links/images resolve. `readme` (default): next to the README file.
//                `repo`: the README will live outside the repo (e.g. a staging dir); links to repo files
//                are checked against the repo file list instead. Images must still resolve next to the README.
// Levels: FAIL (exit 1), WARN, NOTE (both exit 0). Exit 2 = bad input (missing/invalid file). Node >= 18, no deps.
// It checks TOKENS (commands, flags, paths, numbers, versions, badges, licenses, links, hype words); it cannot
// judge whether a sentence describes behaviour correctly. That is the Skeptic step in SKILL.md.
import fs from 'node:fs';
import path from 'node:path';
import {
  UsageError, readText, readJson, loadBanned, norm, validateLedgerShape, resolveEvidence, parseMarkdown,
  extractImages, extractLinks, extractInlineCode, isRemote, isBadgeUrl, fenceCommands, looksLikeShell, tokens, STOP,
} from './lib.mjs';

const PLUMBING = new Set(['cd', 'ls', 'cat', 'mkdir', 'cp', 'mv', 'rm', 'echo', 'export', 'source', 'touch', 'chmod', 'pwd', 'open', 'xdg-open', 'git', 'less', 'head', 'tail', 'grep', 'which', 'code', 'start']);
const GATED = new Set(['python', 'python3', 'py', 'node', 'npm', 'npx', 'yarn', 'pnpm', 'pip', 'pip3', 'pipx', 'make', 'cargo', 'go', 'bundle', 'gem', 'docker', 'brew', 'uv', 'poetry', 'deno', 'bun']);
const INTERP = new Set(['python', 'python3', 'py', 'node', 'deno', 'bun', 'bash', 'sh']);
const PATH_EXT = 'py js mjs cjs ts tsx jsx json md txt csv html css png svg gif yml yaml toml cfg ini sh lock rs go rb java c h cpp mdx jpg jpeg webp pdf'.split(' ');
const PATH_RE = new RegExp(`^[\\w.\\-/]+\\.(${PATH_EXT.join('|')})$`);
const placeholder = (s) => /[<>*${}]|path\/to|your[-_]|\/absolute|example\.(com|org)|\bxxx\b|\.\.\.|^\/?(tmp|var|usr|home|etc)\//i.test(s);

export function lint(opts) {
  const F = []; // findings
  const add = (level, code, line, msg) => F.push({ level, code, line: line ?? null, msg });
  const readme = readText(opts.readme, 'README');
  const ledger = readJson(opts.claims, 'claims ledger');
  const facts = readJson(opts.facts, 'facts file');
  const repo = opts.repo || facts.repo;
  const ledgerDir = path.dirname(path.resolve(opts.claims));
  const readmeDir = path.dirname(path.resolve(opts.readme));
  const imgDir = opts.readmeFinalDir ? path.resolve(opts.readmeFinalDir) : readmeDir;
  const linkBase = opts.linkBase || 'readme';
  if (!['readme', 'repo'].includes(linkBase)) throw new UsageError(`--link-base must be readme or repo (got ${linkBase})`);
  if (!facts.files || !Array.isArray(facts.files)) throw new UsageError('facts file has no files[] - was it produced by scripts/facts.mjs?');
  if (!readme.trim()) throw new UsageError(`README is empty: ${opts.readme}`);

  // ---- 1. ledger shape + evidence ---------------------------------------------------------
  const shapeErrs = validateLedgerShape(ledger);
  shapeErrs.forEach((e) => add('FAIL', 'ledger-shape', null, e));
  const claims = Array.isArray(ledger.claims) ? ledger.claims.filter((c) => c && typeof c === 'object') : [];
  const pinned = claims.filter((c) => c.status === 'PINNED');
  if (!pinned.length) add('FAIL', 'ledger-empty', null, 'ledger has no PINNED claims. A README with no receipts cannot be verified. Run step 3 of SKILL.md and pin claims with evidence.');
  else if (pinned.length < 3) add('WARN', 'ledger-thin', null, `only ${pinned.length} PINNED claims; a thin ledger means little of the README was checked`);
  if (pinned.length > 40) add('WARN', 'ledger-bloat', null, `${pinned.length} PINNED claims exceeds the 40-row soft cap; merge or drop rows nobody will read`);
  const fileCache = new Map();
  const getFile = (p) => { if (!fileCache.has(p)) { let t = ''; try { t = fs.readFileSync(p, 'utf8'); } catch {} fileCache.set(p, norm(t)); } return fileCache.get(p); };
  let evidenceOk = 0, evidenceTotal = 0;
  for (const c of pinned) {
    for (const ev of c.evidence || []) {
      if (!ev || !ev.file) continue;
      evidenceTotal++;
      const abs = resolveEvidence(ev.file, repo, ledgerDir);
      if (!abs) { add('FAIL', 'ledger-evidence-file', null, `${c.id}: evidence file not found: ${ev.file} (looked in repo and next to the ledger)`); continue; }
      if (ev.quote) {
        if (!getFile(abs).includes(norm(ev.quote))) { add('FAIL', 'ledger-quote', null, `${c.id}: quote not found in ${ev.file}: "${String(ev.quote).slice(0, 80)}"`); continue; }
      } else add('WARN', 'ledger-no-quote', null, `${c.id}: evidence ${ev.file} has no quote; a file name alone is a weak receipt`);
      evidenceOk++;
    }
    if (c.kind === 'why' && c.value && c.evidence?.length) {
      const vt = tokens(c.value).filter((t) => !STOP.has(t));
      const evtext = norm(c.evidence.map((e) => e.quote || '').join(' '));
      const hit = vt.filter((t) => evtext.includes(t)).length;
      if (!vt.length || hit / vt.length < 0.6) add('FAIL', 'why-ungrounded', null, `${c.id}: the "why" phrase shares only ${hit}/${vt.length} content words with its quoted evidence; quote the repo's own words`);
    }
  }
  // ---- 1b. entailment: does the quote cover the pinned value? (tokens only; see SKILL.md "What lint cannot check") ----
  let otherRows = 0;
  for (const c of pinned) {
    const qs = norm((c.evidence || []).map((e) => e.quote || '').join(' \n '));
    if (!qs.trim()) continue;
    const v = c.value == null ? '' : String(c.value);
    const bad = (why) => add('FAIL', 'quote-not-entailing', null, `${c.id} (${c.kind}): ${why}. The receipt exists but does not support the value; pick the line that contains it.`);
    if (c.kind === 'command') {
      let t = v.split(/\s+/).filter(Boolean);
      while (t.length && /^[A-Z_][A-Z0-9_]*=/.test(t[0])) t.shift();
      const shellLike = t.length && (GATED.has(t[0]) || INTERP.has(t[0]) || t[0].startsWith('./') || /\.(py|sh|m?js)$/.test(t[0]));
      if (shellLike) {
        if (GATED.has(t[0]) || INTERP.has(t[0]) || t[0].startsWith('./')) t.shift();
        t = t.filter((x) => !/\.(py|m?js|cjs|sh)$/.test(x) && !placeholder(x) && !/^-\w$/.test(x));
        const miss = t.filter((x) => !qs.includes(norm(x)));
        if (miss.length) bad(`command "${v}" has token(s) ${miss.map((x) => '"' + x + '"').join(', ')} that appear in none of its quotes`);
      } else if (v && !(qs.includes(norm(v)) || (c.evidence || []).some((e) => e.quote && norm(v).includes(norm(e.quote))))) bad(`code line "${v.slice(0, 60)}" and its quote do not contain one another`);
    } else if (c.kind === 'flag' || c.kind === 'url' || c.kind === 'output' || c.kind === 'license') {
      if (v && !qs.includes(norm(v))) bad(`value "${v.slice(0, 60)}" is not inside its quote(s)`);
    } else if (c.kind === 'path' || c.kind === 'generated_path') {
      const base = v.split('/').pop();
      const selfEvidence = (c.evidence || []).some((e) => e.file === v || (e.file || '').endsWith('/' + v));
      if (v && !selfEvidence && !qs.includes(norm(base))) bad(`path "${v}" is neither the evidence file itself nor named in a quote`);
    } else if (c.kind === 'number') {
      const miss = [...v.matchAll(/\d+(?:\.\d+)?/g)].map((m) => m[0]).filter((d) => !new RegExp(`(^|[^\\d])${d.replace('.', '\\.')}([^\\d]|$)`).test(qs));
      if (miss.length) bad(`number(s) ${miss.join(', ')} do not appear in the quote(s)`);
    } else if (c.kind === 'requirement') {
      const miss = [...v.matchAll(/\d+(?:\.\d+)?/g)].map((m) => m[0]).filter((d) => !qs.includes(d));
      if (miss.length) bad(`version ${miss.join(', ')} does not appear in the quote(s)`);
    } else if (c.kind === 'other' || c.kind === 'why') {
      if (c.kind === 'other') {
        otherRows++;
        if (!c.carrier) add('WARN', 'other-no-carrier', null, `${c.id}: kind "other" has no "carrier" (the exact words in the quote that carry the claim). Read quote and claim aloud together; if the quote does not entail the claim, change the claim.`);
        else {
          if (!qs.includes(norm(c.carrier))) add('FAIL', 'carrier-not-in-quote', null, `${c.id}: carrier "${String(c.carrier).slice(0, 60)}" is not in its quote(s)`);
          const ct = tokens(c.carrier).filter((x) => !STOP.has(x) && x.length > 2), claimT = new Set(tokens(`${c.text} ${c.value ?? ''}`));
          if (ct.length && ct.filter((x) => claimT.has(x)).length / ct.length < 0.4) add('FAIL', 'carrier-unrelated', null, `${c.id}: the carrier words share too little with the claim text; the quote carries a different claim`);
        }
      }
    }
  }
  if (otherRows) add('NOTE', 'entailment-manual', null, `${otherRows} "other" row(s): lint checks the carrier words exist in the quote, not that they mean what the claim says. That is the manual read-aloud step in SKILL.md.`);

  const val = (c) => norm(c.value ?? c.text);
  const byKind = (k) => pinned.filter((c) => c.kind === k).map(val);
  const pinnedCommands = byKind('command'), pinnedFlags = byKind('flag');
  const pinnedPaths = [...byKind('path'), ...byKind('generated_path')];
  const pinnedUrls = [...byKind('url'), ...byKind('badge')];
  const pinnedReq = byKind('requirement');
  const terms = byKind('term');
  const numWhitelist = new Set();
  for (const c of pinned) for (const m of `${c.value ?? ''} ${c.text}`.matchAll(/\d[\d,.]*/g)) numWhitelist.add(m[0].replace(/[.,]+$/, '').replace(/,/g, ''));
  for (const k of [facts.python?.floor, facts.python?.documented, facts.node?.floor]) if (k) numWhitelist.add(String(k));

  // ---- 2. README structure ------------------------------------------------------------------
  const md = parseMarkdown(readme);
  if (md.fences.some((f) => f.unclosed)) add('FAIL', 'fence-unclosed', md.fences.find((f) => f.unclosed).start, 'unclosed code fence: GitHub will swallow the rest of the page');
  if (!/^#\s+\S/m.test(readme)) add('WARN', 'no-h1', null, 'README has no H1 title');

  // UNKNOWN claims must stay out
  for (const c of claims.filter((x) => x.status === 'UNKNOWN' || x.status === 'UNPARSED')) {
    const v = c.value ? norm(c.value) : null;
    if (v && v.length > 2 && norm(readme).includes(v)) add('FAIL', 'unknown-leaked', null, `${c.id} is ${c.status} but its value appears in the README: "${c.value}". Remove it or verify it.`);
  }

  // process leakage: the README is the product; it must not talk about how it was made
  for (const { n, text } of md.proseLines) {
    const m = /\b(the repo'?s own|the repository'?s own|per the (repo|repository|project)'?s?( own)? (readme|docs?)|per the readme|as the (repo|readme|docs) (states?|says?)|this skill|the ledger|PINNED|cold[- ]reader)\b/i.exec(text);
    if (m) add('FAIL', 'process-leak', n, `README talks about its own making ("${m[0]}"): state the fact, drop the attribution`);
  }

  // "committed" claims about files the repo's .gitignore excludes
  {
    const ign = [];
    for (const f of facts.files) if (f.ignored) ign.push(f.path);
    for (const o of facts.outputs || []) if (o.gitignored) ign.push(o.path);
    for (const c of claims.filter((x) => x.kind === 'generated_path' || x.kind === 'path')) if (c.value && facts.files.some((f) => f.path === c.value && f.ignored)) ign.push(c.value);
    const toks = new Set();
    for (const g of ign) { const b = g.split('/').pop(); toks.add(g.toLowerCase()); toks.add(b.toLowerCase()); toks.add(b.replace(/\.[^.]+$/, '').toLowerCase()); }
    toks.delete('');
    const hit = (s) => [...toks].find((t) => new RegExp(`(^|[^\\w])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w])`, 'i').test(s));
    const COMMITTED = /\b(committed|checked[- ]in|tracked by git|in version control)\b/i;
    for (const { n, text } of md.proseLines) if (COMMITTED.test(text) && hit(text)) add('FAIL', 'committed-but-ignored', n, `line says "${COMMITTED.exec(text)[1]}" about "${hit(text)}", which the repo's .gitignore excludes. Say "generated by <command>" instead.`);
    const ledgerBits = [ledger.visual?.reason || '', ...(ledger.visual?.assets || []).map((a) => a.source || ''), ...pinned.map((c) => c.text || '')];
    for (const b of ledgerBits) if (COMMITTED.test(b) && hit(b)) add('FAIL', 'committed-but-ignored-ledger', null, `ledger text says "${COMMITTED.exec(b)[1]}" about "${hit(b)}", which is gitignored: "${b.slice(0, 80)}". Say "generated" and name the command.`);
  }

  // a placeholder in a command must come with the shape of the thing it stands for
  {
    const fmts = pinned.filter((c) => c.kind === 'format');
    const seen = new Set();
    for (const f of md.fences) if (looksLikeShell(f)) for (const { line, cmd } of fenceCommands(f)) {
      for (const tok of cmd.split(' ').slice(1)) {
        if (!/path\/to|^<[^>]+>$|your[-_]|\/absolute/i.test(tok)) continue;
        const ext = (/\.(\w+)$/.exec(tok) || [])[1];
        const key = ext ? '.' + ext : tok;
        if (seen.has(key)) continue; seen.add(key);
        const row = fmts.find((c) => [].concat(c.applies_to || []).some((a) => a === key || a === tok));
        if (!row) add('FAIL', 'placeholder-no-format', line, `command uses placeholder ${tok} but the ledger has no PINNED "format" row with applies_to "${key}". Pin the shape the repo documents (columns, line format) and show it in the README.`);
        else if (!norm(readme).includes(norm(row.value))) add('FAIL', 'format-not-shown', line, `${row.id}: the format for ${key} ("${String(row.value).slice(0, 50)}") is pinned but not written in the README`);
      }
    }
  }

  // hype words
  const banned = opts.banned || loadBanned();
  for (const { n, text } of md.proseLines) {
    for (const b of banned) {
      if (terms.includes(norm(b.word))) continue;
      if (b.re.test(text)) add('FAIL', 'banned-word', n, `hype word "${b.word}": ${text.trim().slice(0, 70)}`);
    }
  }

  // ---- 3. paths -----------------------------------------------------------------------------
  const fileSet = new Set(facts.files.map((f) => f.path));
  const repoPathExists = (p0) => {
    const p = p0.replace(/^\.\//, '').replace(/[#?].*$/, '').replace(/\/$/, '');
    if (!p || p === '.') return true;
    if (fileSet.has(p) || facts.files.some((f) => f.path.startsWith(p + '/'))) return true;
    if (!p.includes('/') && facts.files.some((f) => f.path.split('/').pop() === p)) return true; // bare file name: exists somewhere in the repo
    if (terms.includes(norm(p))) return true; // ledger `term`: a proper noun such as an external project's name
    return pinnedPaths.some((g) => g === norm(p) || g.endsWith('/' + norm(p)));
  };
  const flagsFor = (sub) => facts.flags.filter((f) => f.sub === sub || f.sub === null).map((f) => f.flag);
  const dynamicFlags = (facts.unparsed || []).some((u) => /built dynamically/.test(u));

  function checkCommand(cmd, line, where) {
    let t = cmd.split(' ').filter(Boolean);
    while (t.length && /^[A-Z_][A-Z0-9_]*=/.test(t[0])) t.shift();
    if (!t.length) return;
    const first = t[0].replace(/^\.\//, '');
    const c = norm(t.join(' '));
    if (PLUMBING.has(first)) {
      if (first === 'git' && t[1] === 'clone') {
        const url = t.slice(2).find((x) => !x.startsWith('-'));
        const clean = (u) => u.replace(/\.git$/, '').replace(/\/$/, '').replace(/^git@github\.com:/, 'https://github.com/').toLowerCase();
        const known = [...(facts.urls || []), ...pinnedUrls].map(clean);
        if (url && !known.includes(clean(url))) add('FAIL', 'clone-url', line, `${where}: git clone URL is not in the repo's own files or the ledger: ${url}`);
      } else if (first !== 'cd') {
        for (const a of t.slice(1)) if (!a.startsWith('-') && !placeholder(a) && PATH_RE.test(a) && !repoPathExists(a) && !repoPathExists(path.posix.join('', a))) add('FAIL', 'path-missing', line, `${where}: path in command does not exist in the repo and is not a pinned generated path: ${a}`);
      }
      return;
    }
    const entryTok = t.findIndex((x, i) => i > 0 && /\.(py|m?js|cjs|sh)$/.test(x) && !x.startsWith('-')) ;
    const isCmdForm = GATED.has(first) || INTERP.has(first) || /\.(py|sh|m?js)$/.test(first) || fileSet.has(first);
    if (!isCmdForm && !pinnedCommands.some((p) => c === p || c.startsWith(p + ' '))) {
      add('FAIL', 'command-unpinned', line, `${where}: command not in the ledger: ${cmd.slice(0, 80)}`); return;
    }
    const factCmds = (facts.commands || []).map((x) => norm(x.cmd));
    const ok = pinnedCommands.some((p) => c === p || c.startsWith(p + ' ') || p.startsWith(c + ' ')) || factCmds.some((p) => c === p || c.startsWith(p + ' ') || p.startsWith(c + ' '));
    // structural checks against facts
    const entry = (facts.entrypoints || []).find((e) => t.some((x) => x.replace(/^\.\//, '') === e.file || path.posix.basename(x) === path.posix.basename(e.file)));
    let structuralFail = false;
    if (entry && entry.kind === 'python-argparse') {
      const k = t.findIndex((x) => x.replace(/^\.\//, '') === entry.file || path.posix.basename(x) === path.posix.basename(entry.file));
      const subs = facts.subcommands.filter((s) => s.file === entry.file).map((s) => s.name);
      let sub = null;
      const nxt = t[k + 1];
      if (subs.length && nxt && !nxt.startsWith('-') && !placeholder(nxt)) {
        if (!subs.includes(nxt)) { add('FAIL', 'command-subcommand', line, `${where}: "${nxt}" is not a subcommand of ${entry.file} (found: ${subs.join(', ')}): ${cmd.slice(0, 70)}`); structuralFail = true; } else sub = nxt;
      }
      const allowed = sub ? flagsFor(sub) : facts.flags.map((f) => f.flag);
      for (const tok of t.slice(k + 1)) {
        const fm = /^(--[\w-]+)/.exec(tok);
        if (!fm || ['--help'].includes(fm[1])) continue;
        if (!allowed.includes(fm[1]) && !pinnedFlags.includes(fm[1])) {
          add(dynamicFlags ? 'WARN' : 'FAIL', 'command-flag', line, `${where}: flag ${fm[1]} is not defined${sub ? ` for "${sub}"` : ''} in ${entry.file}: ${cmd.slice(0, 70)}`); structuralFail = true;
        }
      }
    }
    if (entryTok > -1 && !entry) {
      const f = t[entryTok];
      if (!placeholder(f) && !repoPathExists(f)) { add('FAIL', 'command-entry-missing', line, `${where}: ${f} does not exist in the repo and is not a pinned generated path`); structuralFail = true; }
    }
    if (first === 'npm' || first === 'yarn' || first === 'pnpm') {
      const scripts = facts.npm?.scripts || {};
      const run = t[1] === 'run' || t[1] === 'run-script' ? t[2] : t[1] === 'test' ? 'test' : null;
      if (run && !(run in scripts) && !placeholder(run)) { add('FAIL', 'command-npm-script', line, `${where}: package.json has no script "${run}" (found: ${Object.keys(scripts).join(', ') || 'none'})`); structuralFail = true; }
    }
    if (first === 'make' && t[1] && !t[1].startsWith('-') && facts.make_targets?.length && !facts.make_targets.includes(t[1])) { add('FAIL', 'command-make-target', line, `${where}: Makefile has no target "${t[1]}"`); structuralFail = true; }
    if (!ok && !structuralFail) add('FAIL', 'command-unpinned', line, `${where}: command is in neither the ledger nor the extracted facts: ${cmd.slice(0, 80)}`);
  }

  // fences
  let skippedFences = 0;
  for (const f of md.fences) {
    if (looksLikeShell(f)) for (const { line, cmd } of fenceCommands(f)) checkCommand(cmd, line, 'code block');
    else skippedFences++;
  }
  if (skippedFences) add('NOTE', 'fences-unchecked', null, `${skippedFences} code block(s) are not shell (output samples or other languages); their contents are checked only if firstscreen.mjs or the ledger pins them`);

  // inline code
  for (const { line, code } of extractInlineCode(md.proseLines)) {
    const c = code.trim();
    if (GATED.has(c.split(' ')[0]) && c.includes(' ') ) { checkCommand(c, line, 'inline code'); continue; }
    if (placeholder(c) || /\s/.test(c)) continue;
    if (/^--[\w-]+/.test(c)) {
      const fl = /^(--[\w-]+)/.exec(c)[1];
      if (facts.flags.length && !facts.flags.some((x) => x.flag === fl) && !pinnedFlags.includes(fl) && fl !== '--help') add('WARN', 'inline-flag', line, `flag ${fl} not defined anywhere in the parsed CLI`);
      continue;
    }
    if (isRemote(c)) continue;
    if (PATH_RE.test(c) || (c.includes('/') && /\.\w{1,5}$/.test(c))) {
      if (!repoPathExists(c) && !(linkBase === 'readme' && fs.existsSync(path.resolve(readmeDir, c)))) add('FAIL', 'path-missing', line, `inline path does not exist in the repo and is not a pinned generated path: ${c}`);
    }
  }

  // images
  const imgs = extractImages(md.proseLines);
  for (const im of imgs) {
    if (!im.isSource && (im.alt === null || im.alt.trim() === '')) add('FAIL', 'img-alt', im.line, `image has no alt text: ${im.src}`);
    if (isRemote(im.src)) {
      if (isBadgeUrl(im.src)) {
        const s = norm(im.src);
        if (!pinnedUrls.some((u) => u && s.includes(u))) add('FAIL', 'badge-unpinned', im.line, `badge has no PINNED "badge" claim in the ledger: ${im.src.slice(0, 80)}`);
        if (/workflows?\/|actions|travis|circleci/i.test(im.src) && !(facts.ci_workflows || []).length) add('FAIL', 'badge-ci-missing', im.line, `CI badge but the repo has no .github/workflows: ${im.src.slice(0, 80)}`);
        if (/npm|badge\.fury/i.test(im.src) && !facts.npm?.name) add('FAIL', 'badge-registry-missing', im.line, 'npm-style badge but the repo has no package.json name');
        if (/pypi/i.test(im.src) && !facts.python?.package_name) add('FAIL', 'badge-registry-missing', im.line, 'PyPI badge but no package name in pyproject.toml');
        if (/license/i.test(im.src) && !facts.license) add('FAIL', 'badge-license-missing', im.line, 'license badge but the repo has no license');
        if (/coverage|codecov|coveralls/i.test(im.src)) add('FAIL', 'badge-coverage', im.line, 'coverage badge: nothing in the repo produces coverage data');
      } else if (!pinnedUrls.some((u) => u && norm(im.src).includes(u))) add('FAIL', 'img-remote', im.line, `remote image not pinned in the ledger (use committed assets): ${im.src.slice(0, 80)}`);
      continue;
    }
    const src = im.src.replace(/[#?].*$/, '');
    const here = path.resolve(imgDir, src);
    if (!fs.existsSync(here)) add('FAIL', 'img-missing', im.line, `image does not resolve next to the README${opts.readmeFinalDir ? ' (final dir ' + imgDir + ')' : ''}: ${im.src}`);
  }

  // links
  const headings = new Set(md.lines.filter((l) => /^#{1,6}\s/.test(l)).map((l) => l.replace(/^#+\s*/, '').toLowerCase().replace(/[^\w\- ]/g, '').trim().replace(/ /g, '-')));
  for (const l of extractLinks(md.proseLines)) {
    const h = l.href;
    if (h.startsWith('#')) { if (!headings.has(h.slice(1).toLowerCase())) add('WARN', 'anchor-missing', l.line, `anchor ${h} matches no heading`); continue; }
    if (isRemote(h)) {
      if (h.startsWith('mailto:')) continue;
      const clean = h.replace(/\/$/, '').toLowerCase();
      const known = [...(facts.urls || []), ...pinnedUrls].map((u) => u.replace(/\/$/, '').toLowerCase());
      if (!known.some((u) => u && (clean === u || clean.startsWith(u) || u.startsWith(clean)))) add('WARN', 'link-unpinned', l.line, `external link not found in the repo's own files or the ledger: ${h.slice(0, 80)}`);
      continue;
    }
    const target = h.replace(/[#?].*$/, '');
    if (!target || placeholder(target)) continue;
    const onDisk = fs.existsSync(path.resolve(readmeDir, target));
    if (linkBase === 'repo') { if (!onDisk && !repoPathExists(target)) add('FAIL', 'link-missing', l.line, `link target not found in the README dir or the repo: ${h}`); }
    else if (!onDisk) add('FAIL', 'link-missing', l.line, `link target does not exist next to the README: ${h}`);
  }

  // ---- 4. versions, license, stdlib ----------------------------------------------------------
  const proseNoCode = md.proseLines.map((l) => ({ n: l.n, text: l.text }));
  const all = [...proseNoCode, ...md.fences.flatMap((f) => f.lines)];
  for (const { n, text } of proseNoCode) {
    for (const m of text.matchAll(/\bPython\s*(\d+(?:\.\d+)*)/gi)) {
      const v = m[1]; const known = facts.python?.floor || facts.python?.documented;
      if (known) { if (!(known === v || known.startsWith(v + '.') || v.startsWith(known + '.'))) add('FAIL', 'req-python', n, `README says Python ${v} but the repo says ${known} (${facts.python?.floor ? facts.python.floor_source : facts.python.documented_source})`); }
      else if (!pinnedReq.some((r) => r.includes(v))) add('FAIL', 'req-python-unpinned', n, `Python ${v} has no source: no manifest floor and no PINNED requirement claim`);
    }
    for (const m of text.matchAll(/\bNode(?:\.js)?\s*(?:v|>=?\s*)?(\d+)/gi)) {
      const v = m[1]; const known = facts.node?.floor;
      if (known) { if (known !== v) add('FAIL', 'req-node', n, `README says Node ${v} but package.json engines says ${facts.node.floor_raw}`); }
      else if (!pinnedReq.some((r) => r.includes(v))) add('FAIL', 'req-node-unpinned', n, `Node ${v} has no source: no engines field and no PINNED requirement claim`);
    }
    if (/licen[sc]e/i.test(text)) {
      for (const m of text.matchAll(/\b(MIT|Apache[- ]?2(?:\.0)?|GPL(?:-?v?\d(?:\.\d)?)?|AGPL|LGPL|BSD(?:-\d-Clause)?|ISC|MPL(?:-2\.0)?|Unlicense)\b/g)) {
        const said = m[1].toLowerCase().replace(/[^a-z0-9]/g, '');
        const have = facts.license?.type ? String(facts.license.type).toLowerCase().replace(/[^a-z0-9]/g, '') : null;
        if (!have) { if (!pinned.some((c) => c.kind === 'license' && norm(c.value ?? c.text).replace(/[^a-z0-9]/g, '').includes(said))) add('FAIL', 'req-license', n, `README names license ${m[1]} but the repo has no license file/field`); }
        else if (have === 'unknown') add('WARN', 'req-license-unknown', n, `README names ${m[1]} but the LICENSE text was not recognised; check it by hand`);
        else if (!(have.startsWith(said) || said.startsWith(have))) add('FAIL', 'req-license', n, `README says ${m[1]} but the repo license is ${facts.license.type}`);
      }
    }
    if (/(standard library only|only the standard library|stdlib only|zero[- ]dependenc|no (external |third[- ]party )?dependenc)/i.test(text)) {
      const py = facts.imports?.stdlib_only, js = facts.npm ? facts.npm.dependencies.length === 0 : null;
      const ok = py === true || js === true || pinned.some((c) => /depend|stdlib|standard library/i.test(c.text));
      if (!ok) add('FAIL', 'claim-stdlib', n, 'README claims no dependencies / stdlib only but the extracted imports or package.json show otherwise (or nothing proves it)');
    }
  }

  // ---- 5. numbers ------------------------------------------------------------------------------
  const METRIC_NOUN = /^(users?|stars?|downloads?|customers?|teams?|companies|developers?|projects?|contributors?|installs?|requests?|lines|commits|tests?|languages?|integrations?|plugins?|endpoints?|ms|milliseconds?|seconds?|minutes?|hours?|x|times|faster|slower|percent|mb|gb|kb)$/i;
  for (const { n, text } of proseNoCode) {
    let t = text.replace(/`[^`]*`/g, ' ').replace(/!?\[[^\]]*\]\([^)]*\)/g, ' ').replace(/https?:\/\/\S+/g, ' ').replace(/<[^>]+>/g, ' ')
      .replace(/^\s*\d+[.)]\s+/, ' ').replace(/\b\d{4}-\d{2}-\d{2}\b/g, ' ').replace(/\b(19|20)\d{2}\b/g, ' ');
    for (const m of t.matchAll(/(?<![\w.$-])(\d[\d,]*(?:\.\d+)?)(\s?(?:%|×|x\b))?(?:\+)?(?:\s+([A-Za-z]+))?/g)) {
      const raw = m[1].replace(/,/g, '');
      const before = t.slice(Math.max(0, m.index - 8), m.index);
      if (/(python|node(?:\.js)?|v|version)\s*$/i.test(before)) continue;
      const metric = !!m[2] || (m[3] && METRIC_NOUN.test(m[3]));
      const known = numWhitelist.has(raw) || numWhitelist.has(m[1]);
      if (known) continue;
      if (metric) add('FAIL', 'number-invented', n, `number "${m[0].trim()}" reads as a measurement but no PINNED claim backs it`);
      else if (Number(raw) > 10) add('WARN', 'number-unpinned', n, `number "${m[1]}" has no PINNED claim`);
    }
  }
  void all;

  // ---- 6. honesty about coverage ------------------------------------------------------------------
  for (const u of facts.unparsed || []) add('NOTE', 'facts-unparsed', null, `facts did not cover: ${u}. Lint cannot verify those; pin by hand or leave it out.`);
  if (!(facts.commands || []).length) add('NOTE', 'facts-no-commands', null, 'no commands were extracted automatically; all commands in the README are checked against the ledger only');
  const stats = { fail: F.filter((f) => f.level === 'FAIL').length, warn: F.filter((f) => f.level === 'WARN').length, note: F.filter((f) => f.level === 'NOTE').length,
    pinned: pinned.length, evidence_ok: evidenceOk, evidence_total: evidenceTotal, claims: claims.length };
  return { findings: F, stats };
}

if (process.argv[1] && process.argv[1].endsWith('lint.mjs')) {
  const a = process.argv.slice(2);
  const opt = (k) => { const i = a.indexOf(k); return i > -1 ? a[i + 1] : undefined; };
  const pos = a.filter((x, i) => !x.startsWith('--') && !['--repo', '--link-base', '--readme-final-dir'].includes(a[i - 1]));
  try {
    if (pos.length < 3) throw new UsageError('need three arguments');
    const { findings, stats } = lint({ readme: pos[0], claims: pos[1], facts: pos[2], repo: opt('--repo'), linkBase: opt('--link-base'), readmeFinalDir: opt('--readme-final-dir') });
    if (a.includes('--json')) console.log(JSON.stringify({ findings, stats }, null, 2));
    else {
      for (const f of findings) console.log(`${f.level.padEnd(4)} ${f.code}${f.line ? ` (line ${f.line})` : ''}: ${f.msg}`);
      console.log(`lint: ${stats.fail} FAIL, ${stats.warn} WARN, ${stats.note} NOTE | ledger ${stats.pinned} pinned, evidence ${stats.evidence_ok}/${stats.evidence_total} verified`);
      console.log(stats.fail ? 'lint: FAILED - fix every FAIL, then re-run' : 'lint: PASSED (tokens only; sentence meaning is the Skeptic step)');
    }
    process.exit(stats.fail ? 1 : 0);
  } catch (e) {
    if (e instanceof UsageError) { console.error(`lint: ${e.message}\nUsage: node lint.mjs <readme.md> <claims.json> <facts.json> [--repo DIR] [--link-base readme|repo] [--readme-final-dir DIR] [--json]`); process.exit(2); }
    throw e;
  }
}
