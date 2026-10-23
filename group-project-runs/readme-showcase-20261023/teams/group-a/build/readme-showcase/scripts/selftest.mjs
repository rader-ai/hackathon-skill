#!/usr/bin/env node
// selftest.mjs - proves the skill's scripts work on repos that are NOT your target, and that the linter catches lies.
// Usage: node selftest.mjs [--quiet]
// What it does (all inside a temp dir; fixtures and any target repo are never modified):
//   1. facts.mjs on 3 fixture repos (python CLI, node library, near-empty Go repo) vs selftest/fixtures/*/expected.json
//   2. lint + firstscreen + assets-check on each clean README: must pass
//   3. applies every seeded lie (selftest/fixtures/*/lies.json) to the clean README: lint must FAIL with the expected code
//   4. bad-input behaviour of every script: must exit non-zero with a readable message
//   5. facts.mjs leaves the repo byte-identical; shot.mjs yields a differing dark capture when Chrome+ImageMagick exist
// Exit 0 only if everything passes. Prints the seeded-lie recall as a number. Node >= 18, no deps.
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractFacts } from './facts.mjs';
import { lint } from './lint.mjs';
import { firstScreen } from './firstscreen.mjs';
import { assetsCheck } from './assets-check.mjs';
import { loadBanned } from './lib.mjs';
import { findChrome } from './check-env.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIX = path.join(HERE, '..', 'selftest', 'fixtures');
const quiet = process.argv.includes('--quiet');
let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => { if (cond) { pass++; if (!quiet) console.log(`  ok   ${name}`); } else { fail++; console.log(`  FAIL ${name}${detail ? ' :: ' + detail : ''}`); } };
const run = (script, args) => spawnSync(process.execPath, [path.join(HERE, script), ...args], { encoding: 'utf8' });
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const tmp = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'readme-showcase-selftest-'));
const hashDir = (d) => { const h = crypto.createHash('sha256'); const w = (p) => { for (const e of fs.readdirSync(p, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) { const f = path.join(p, e.name); if (e.isDirectory()) w(f); else h.update(f.slice(d.length) + fs.readFileSync(f)); } }; w(d); return h.digest('hex'); };
const banned = loadBanned();

function applyLie(text, lie) {
  if (lie.op === 'replace') { if (!text.includes(lie.find)) throw new Error(`lie ${lie.id}: find-string not in clean README: ${JSON.stringify(lie.find)}`); return text.replace(lie.find, lie.with); }
  if (lie.op === 'append') return text + lie.text;
  if (lie.op === 'none') return text; // the lie lives in lie.ledger / lie.facts only
  throw new Error(`lie ${lie.id}: unknown op ${lie.op}`);
}

let liesTotal = 0, liesCaught = 0;
const fixtures = fs.readdirSync(FIX).filter((d) => fs.statSync(path.join(FIX, d)).isDirectory()).sort();
if (fixtures.length < 3) { console.error(`selftest: expected 3 fixtures in ${FIX}, found ${fixtures.length}`); process.exit(2); }

try {
  for (const name of fixtures) {
    console.log(`\n== fixture: ${name}`);
    const src = path.join(FIX, name);
    const work = path.join(tmp, name);
    fs.cpSync(src, work, { recursive: true });
    const exp = JSON.parse(fs.readFileSync(path.join(src, 'expected.json'), 'utf8'));
    const before = hashDir(path.join(src, 'repo'));
    const facts = extractFacts(path.join(work, 'repo'));
    const factsPath = path.join(work, 'facts.json');
    fs.writeFileSync(factsPath, JSON.stringify(facts));
    ok(`${name}: facts.mjs leaves the repo byte-identical`, hashDir(path.join(src, 'repo')) === before);

    // 1. facts vs expected
    for (const [k, want] of Object.entries(exp.facts)) {
      if (k === 'unparsed_contains') { ok(`${name}: facts.unparsed mentions ${want}`, facts.unparsed.some((u) => u.includes(want)), JSON.stringify(facts.unparsed)); continue; }
      if (k === 'subcommands') { const got = facts.subcommands.map((s) => s.name).sort(); ok(`${name}: subcommands = ${JSON.stringify(want)}`, JSON.stringify(got) === JSON.stringify([...want].sort()), JSON.stringify(got)); continue; }
      if (k === 'commands') { const got = facts.commands.map((c) => c.cmd); ok(`${name}: commands ${want.length ? 'include ' + JSON.stringify(want) : 'are empty'}`, want.length ? want.every((w) => got.includes(w)) : got.length === 0, JSON.stringify(got)); continue; }
      if (k === 'flags') { ok(`${name}: flags include ${want.map((w) => `${w.sub}${w.flag}`).join(', ')}`, want.every((w) => facts.flags.some((f) => f.sub === w.sub && f.flag === w.flag && (w.required === undefined || f.required === w.required))), JSON.stringify(facts.flags)); continue; }
      if (k === 'outputs.paths') { ok(`${name}: outputs include ${want}`, want.every((w) => facts.outputs.some((o) => o.path === w)), JSON.stringify(facts.outputs.map((o) => o.path))); continue; }
      ok(`${name}: facts.${k} = ${JSON.stringify(want)}`, JSON.stringify(get(facts, k)) === JSON.stringify(want), `got ${JSON.stringify(get(facts, k))}`);
    }

    // 2. clean README passes
    const readme = path.join(work, 'README.clean.md');
    const ledger = path.join(work, 'claims.json');
    const linkBase = exp.link_base || 'readme';
    const base = lint({ readme, claims: ledger, facts: factsPath, repo: path.join(work, 'repo'), linkBase });
    ok(`${name}: clean README lints with ${exp.clean.lint_fail} FAIL`, base.stats.fail === exp.clean.lint_fail, base.findings.filter((f) => f.level === 'FAIL').map((f) => f.code + ': ' + f.msg).join(' | '));
    if (exp.clean.lint_notes_min) ok(`${name}: lint prints >= ${exp.clean.lint_notes_min} NOTE about unparsed areas (never passes vacuously)`, base.stats.note >= exp.clean.lint_notes_min);
    const fsr = firstScreen({ readme, claims: ledger, lines: 40, banned });
    ok(`${name}: first-screen gate ${exp.clean.firstscreen}`, (fsr.every((r) => r.ok)) === (exp.clean.firstscreen === 'pass'), fsr.filter((r) => !r.ok).map((r) => r.id + ': ' + r.msg).join(' | '));
    if (exp.clean.assets === 'pass') { const a = assetsCheck(path.join(work, 'assets')); ok(`${name}: assets-check passes`, !a.results.some((r) => r.level === 'FAIL'), JSON.stringify(a.results.filter((r) => r.level === 'FAIL'))); }

    // 3. seeded lies
    const lies = JSON.parse(fs.readFileSync(path.join(src, 'lies.json'), 'utf8'));
    const cleanText = fs.readFileSync(readme, 'utf8');
    for (const lie of lies) {
      liesTotal++;
      const mdir = path.join(tmp, `${name}-lie-${lie.id}`);
      fs.cpSync(work, mdir, { recursive: true });
      fs.writeFileSync(path.join(mdir, 'README.clean.md'), applyLie(cleanText, lie));
      let lieFacts = factsPath;
      if (lie.ledger) { // {id, set:{...}}: replace fields of one ledger row (a receipt that exists but does not entail the claim)
        const L = JSON.parse(fs.readFileSync(path.join(mdir, 'claims.json'), 'utf8'));
        const row = L.claims.find((c) => c.id === lie.ledger.id); if (!row) throw new Error(`lie ${lie.id}: no ledger row ${lie.ledger.id}`);
        Object.assign(row, lie.ledger.set); fs.writeFileSync(path.join(mdir, 'claims.json'), JSON.stringify(L));
      }
      if (lie.facts_ignore) { // mark files as gitignored in a copy of facts.json
        const F = JSON.parse(fs.readFileSync(factsPath, 'utf8'));
        for (const f of F.files) if (lie.facts_ignore.includes(f.path)) f.ignored = true;
        for (const o of F.outputs || []) if (lie.facts_ignore.includes(o.path)) { o.gitignored = true; o.committed_candidate = false; }
        lieFacts = path.join(mdir, 'facts.lie.json'); fs.writeFileSync(lieFacts, JSON.stringify(F));
      }
      const r = lint({ readme: path.join(mdir, 'README.clean.md'), claims: path.join(mdir, 'claims.json'), facts: lieFacts, repo: path.join(mdir, 'repo'), linkBase });
      const fails = r.findings.filter((f) => f.level === 'FAIL');
      const hit = fails.some((f) => f.code === lie.expect);
      if (hit) liesCaught++;
      ok(`${name}: lie "${lie.id}" -> FAIL ${lie.expect}`, hit, `FAIL codes seen: ${fails.map((f) => f.code).join(', ') || 'none'}`);
    }
  }

  // 4. bad input behaviour
  console.log('\n== bad input fails loudly');
  const cli = path.join(FIX, 'cli-tool');
  const cliWork = path.join(tmp, 'cli-tool');
  const cliFacts = path.join(cliWork, 'facts.json');
  const expectExit = (label, res, code, needle) => ok(label, res.status === code && (!needle || (res.stderr + res.stdout).includes(needle)), `exit ${res.status}; ${(res.stderr + res.stdout).trim().slice(0, 160)}`);
  expectExit('lint: missing README -> exit 2 + "not found"', run('lint.mjs', [path.join(tmp, 'nope.md'), path.join(cliWork, 'claims.json'), cliFacts]), 2, 'not found');
  fs.writeFileSync(path.join(tmp, 'empty-ledger.json'), '{"claims":[]}');
  expectExit('lint: empty ledger -> exit 1 + ledger-empty', run('lint.mjs', [path.join(cliWork, 'README.clean.md'), path.join(tmp, 'empty-ledger.json'), cliFacts, '--link-base', 'repo', '--repo', path.join(cliWork, 'repo')]), 1, 'ledger-empty');
  fs.writeFileSync(path.join(tmp, 'bad.json'), '{not json');
  expectExit('lint: invalid JSON ledger -> exit 2 + "not valid JSON"', run('lint.mjs', [path.join(cliWork, 'README.clean.md'), path.join(tmp, 'bad.json'), cliFacts]), 2, 'not valid JSON');
  expectExit('lint: too few arguments -> exit 2 + usage', run('lint.mjs', []), 2, 'Usage');
  expectExit('facts: missing repo dir -> exit 2', run('facts.mjs', [path.join(tmp, 'no-such-repo')]), 2, 'not found');
  expectExit('facts: refuses to write inside the repo', run('facts.mjs', [path.join(cliWork, 'repo'), '--out', path.join(cliWork, 'repo', 'facts.json')]), 2, 'refusing');
  fs.mkdirSync(path.join(tmp, 'empty-dir'));
  expectExit('facts: empty directory -> exit 2', run('facts.mjs', [path.join(tmp, 'empty-dir')]), 2, 'empty');
  fs.writeFileSync(path.join(tmp, 'generic.md'), '# Acme\n\nAcme is a powerful, seamless tool for managing things.\n\n```bash\nacme run\n```\n');
  const g = run('firstscreen.mjs', [path.join(tmp, 'generic.md'), path.join(cliWork, 'claims.json')]);
  expectExit('firstscreen: generic hype opener -> exit 1', g, 1, 'FAILED');
  ok('firstscreen: names the failed checks (opener-nouns, no-hype)', /FAIL opener-nouns/.test(g.stdout) && /FAIL no-hype/.test(g.stdout), g.stdout);
  const a1 = path.join(tmp, 'assets-unpaired'); fs.mkdirSync(a1); fs.copyFileSync(path.join(cli, 'assets', 'report-light.png'), path.join(a1, 'report-light.png'));
  expectExit('assets-check: light without dark -> exit 1 + pair message', run('assets-check.mjs', [a1]), 1, 'missing its dark pair');
  const a2 = path.join(tmp, 'assets-empty'); fs.mkdirSync(a2);
  expectExit('assets-check: empty dir -> exit 1', run('assets-check.mjs', [a2]), 1, 'no images');
  expectExit('assets-check: empty dir with --allow-empty -> exit 0', run('assets-check.mjs', [a2, '--allow-empty']), 0);
  expectExit('assets-check: tiny budget -> exit 1', run('assets-check.mjs', [path.join(cli, 'assets'), '--budget-bytes', '1000']), 1, 'exceeds');
  expectExit('assets-check: missing dir -> exit 2', run('assets-check.mjs', [path.join(tmp, 'nope')]), 2, 'not found');
  expectExit('check-env: unknown tool -> exit 2', run('check-env.mjs', ['--need', 'bogus']), 2, 'unknown tool');
  expectExit('shot: missing html -> exit 2', run('shot.mjs', [path.join(tmp, 'nope.html'), '--out', tmp, '--name', 'x']), 2, 'not found');
  const good = path.join(tmp, 'ans-good.json'), bad = path.join(tmp, 'ans-bad.json');
  fs.writeFileSync(good, JSON.stringify({ does: 'Reads a web access log and prints a ranked list of paths', audience: 'Developers who have raw logs and no dashboard', command: 'python3 tally.py count examples/sample.log --top 3' }));
  fs.writeFileSync(bad, JSON.stringify({ does: 'A productivity helper', audience: 'Everyone', command: 'npm start' }));
  expectExit('cold-reader-check: matching answer -> exit 0', run('cold-reader-check.mjs', ['check', good, path.join(cliWork, 'claims.json')]), 0, 'PASSED');
  expectExit('cold-reader-check: mismatching answer -> exit 1', run('cold-reader-check.mjs', ['check', bad, path.join(cliWork, 'claims.json')]), 1, 'MISMATCH');
  // new gates: producer, quickstart, audience waiver, final-dir images
  const wl = (name, mut) => { const L = JSON.parse(fs.readFileSync(path.join(cliWork, 'claims.json'), 'utf8')); mut(L); const f = path.join(tmp, name); fs.writeFileSync(f, JSON.stringify(L)); return f; };
  const p1 = run('firstscreen.mjs', [path.join(cliWork, 'README.clean.md'), wl('l-model.json', (L) => { L.first_screen.output_producer = 'model'; L.first_screen.producer_phrase = 'a model writes the list'; })]);
  ok('firstscreen: output produced by a model but the page never says so -> FAIL producer', p1.status === 1 && /FAIL producer/.test(p1.stdout), p1.stdout);
  const p2 = run('firstscreen.mjs', [path.join(cliWork, 'README.clean.md'), wl('l-qs.json', (L) => { L.first_screen.quickstart_lines = ['git clone https://example.org/x.git', 'python3 tally.py count examples/sample.log --top 3']; })]);
  ok('firstscreen: a documented clone line missing from the first screen -> FAIL quickstart', p2.status === 1 && /FAIL quickstart/.test(p2.stdout), p2.stdout);
  const p3 = run('firstscreen.mjs', [path.join(cliWork, 'README.clean.md'), wl('l-shows.json', (L) => { delete L.visual.shows; })]);
  ok('firstscreen: image without visual.shows -> FAIL visual-shows', p3.status === 1 && /FAIL visual-shows/.test(p3.stdout), p3.stdout);
  const waivedL = wl('l-waived.json', (L) => { L.first_screen.audience_waived = 'the repo never states who it is for'; });
  const noAud = path.join(tmp, 'ans-noaud.json'); fs.writeFileSync(noAud, JSON.stringify({ does: 'Reads a web access log and prints a ranked list', audience: 'unclear', command: 'python3 tally.py count examples/sample.log --top 3' }));
  const wv = run('cold-reader-check.mjs', ['check', noAud, waivedL]);
  ok('cold-reader-check: audience waived with a reason -> exit 0 and the waiver is printed', wv.status === 0 && /audience waived/.test(wv.stdout), wv.stdout);
  const nw = run('cold-reader-check.mjs', ['check', noAud, path.join(cliWork, 'claims.json')]);
  ok('cold-reader-check: audience "unclear" without a waiver -> exit 1 (the waiver is what makes it pass)', nw.status === 1 && /FAIL audience/.test(nw.stdout), nw.stdout);
  const fd = path.join(tmp, 'staged'); fs.mkdirSync(fd);
  fs.copyFileSync(path.join(cliWork, 'README.clean.md'), path.join(fd, 'README.draft.md'));
  const rf = run('lint.mjs', [path.join(fd, 'README.draft.md'), path.join(cliWork, 'claims.json'), cliFacts, '--link-base', 'repo', '--repo', path.join(cliWork, 'repo'), '--readme-final-dir', cliWork]);
  ok('lint: --readme-final-dir resolves images without any symlink next to the draft', rf.status === 0, rf.stdout);
  const rn = run('lint.mjs', [path.join(fd, 'README.draft.md'), path.join(cliWork, 'claims.json'), cliFacts, '--link-base', 'repo', '--repo', path.join(cliWork, 'repo')]);
  ok('lint: the same draft without --readme-final-dir fails with img-missing (so the flag is what fixes it)', rn.status === 1 && /img-missing/.test(rn.stdout), rn.stdout);
  const pk = path.join(tmp, 'screen.md');
  expectExit('cold-reader-check pack: writes the first screen', run('cold-reader-check.mjs', ['pack', path.join(cliWork, 'README.clean.md'), '--out', pk]), 0);
  ok('cold-reader pack: file has <= 40 lines', fs.readFileSync(pk, 'utf8').trimEnd().split('\n').length <= 40);

  // 5. shot.mjs
  console.log('\n== screenshot (needs Chrome + ImageMagick)');
  const hasMagick = spawnSync('which', ['magick']).status === 0 || spawnSync('which', ['convert']).status === 0;
  if (!findChrome() || !hasMagick) console.log(`  SKIP shot.mjs test: ${!findChrome() ? 'no Chrome/Chromium' : 'no ImageMagick'} (install it, or set CHROME_BIN; this skip is NOT a pass for the visuals step)`);
  else {
    const out = path.join(tmp, 'shots');
    const r = run('shot.mjs', [path.join(cliWork, 'repo', 'out', 'sample-report.html'), '--out', out, '--name', 'st', '--height', '400', '--crop', '1760x300+0+0']);
    ok('shot: exit 0 and writes a light/dark pair', r.status === 0 && fs.existsSync(path.join(out, 'st-light.png')) && fs.existsSync(path.join(out, 'st-dark.png')), r.stderr);
    if (r.status === 0) {
      const dm = (f) => { const b = fs.readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
      ok('shot: crop gives exactly 1760x300 for both', JSON.stringify(dm(path.join(out, 'st-light.png'))) === '[1760,300]' && JSON.stringify(dm(path.join(out, 'st-dark.png'))) === '[1760,300]');
      ok('shot: dark capture differs from light (prefers-color-scheme honoured)', !fs.readFileSync(path.join(out, 'st-light.png')).equals(fs.readFileSync(path.join(out, 'st-dark.png'))));
      const cl = run('shot.mjs', [path.join(cliWork, 'repo', 'out', 'sample-report.html'), '--out', path.join(tmp, 'clipshots'), '--name', 'cl', '--only', 'light', '--clip', 'table']);
      ok('shot: --clip table crops to the element (exit 0, output exists)', cl.status === 0 && fs.existsSync(path.join(tmp, 'clipshots', 'cl-light.png')), cl.stderr + cl.stdout);
      const ls = run('shot.mjs', [path.join(cliWork, 'repo', 'out', 'sample-report.html'), '--list']);
      ok('shot: --list prints candidate selectors', ls.status === 0 && /table/.test(ls.stdout), ls.stderr + ls.stdout);
      const ac = assetsCheck(out, { minWidth: 880 }); ok('shot output passes assets-check pairing', !ac.results.some((x) => x.level === 'FAIL'), JSON.stringify(ac.results.filter((x) => x.level === 'FAIL')));
    }
  }
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }

console.log(`\nselftest: ${pass} checks passed, ${fail} failed`);
console.log(`selftest: seeded lies caught ${liesCaught}/${liesTotal} (recall ${(100 * liesCaught / Math.max(1, liesTotal)).toFixed(0)}%)`);
if (fail || liesCaught !== liesTotal) { console.log('selftest: FAILED'); process.exit(1); }
console.log('selftest: PASSED');
