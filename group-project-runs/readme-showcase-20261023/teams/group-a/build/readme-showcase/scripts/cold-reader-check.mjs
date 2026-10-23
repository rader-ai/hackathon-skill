#!/usr/bin/env node
// cold-reader-check.mjs - compare a fresh reader's answer with the ledger, and cut the first screen to hand them.
// Usage:
//   node cold-reader-check.mjs pack <readme.md> --out <file.md> [--lines 40]    # the only thing the cold reader may see
//   node cold-reader-check.mjs check <answer.json> <claims.json>               # answer = {"does":"...","audience":"...","command":"..."}
// check passes when: "does" names the ledger input and output nouns; "command" matches a PINNED command (or the ledger
// declares no command); "audience" is non-empty, unless ledger.first_screen.audience_waived holds a reason (>= 15 chars):
// then audience is not checked and the waiver is printed so the final report can repeat it. Exit 0 pass, 1 mismatch, 2 bad input. Node >= 18, no deps.
import fs from 'node:fs';
import path from 'node:path';
import { UsageError, readText, readJson, norm } from './lib.mjs';

const [mode, ...rest] = process.argv.slice(2);
try {
  if (mode === 'pack') {
    const readme = rest.find((x, i) => !x.startsWith('--') && !['--out', '--lines'].includes(rest[i - 1]));
    const oi = rest.indexOf('--out'); const li = rest.indexOf('--lines');
    if (!readme || oi < 0 || !rest[oi + 1]) throw new UsageError('pack needs <readme.md> --out <file>');
    const n = li > -1 ? Number(rest[li + 1]) : 40;
    const all = readText(readme, 'README').split('\n');
    let cut = Math.min(n, all.length), open = false;
    for (let i = 0; i < cut; i++) if (/^\s*(```|~~~)/.test(all[i])) open = !open;
    if (open) { while (cut < all.length && !/^\s*(```|~~~)\s*$/.test(all[cut])) cut++; cut = Math.min(cut + 1, all.length); } // never slice a code fence in half
    const body = all.slice(0, cut).join('\n');
    fs.mkdirSync(path.dirname(path.resolve(rest[oi + 1])), { recursive: true });
    fs.writeFileSync(rest[oi + 1], body + '\n');
    console.log(`cold-reader: wrote first ${cut} lines to ${rest[oi + 1]}. Images appear only as alt text, as they do for a skimming reader.`);
  } else if (mode === 'check') {
    if (rest.length < 2) throw new UsageError('check needs <answer.json> <claims.json>');
    const ans = readJson(rest[0], 'answer file'); const L = readJson(rest[1], 'claims ledger');
    for (const k of ['does', 'audience', 'command']) if (typeof ans[k] !== 'string') throw new UsageError(`answer.json needs a string field "${k}"`);
    const fsn = L.first_screen; if (!fsn?.input_noun || !fsn?.output_noun) throw new UsageError('ledger.first_screen needs input_noun and output_noun');
    const waived = typeof fsn.audience_waived === 'string' && fsn.audience_waived.trim().length >= 15;
    if (waived) console.log(`NOTE audience waived: ${fsn.audience_waived} (repeat this in the final report)`);
    const has = (s, n) => new RegExp(`(^|[^\\w])${norm(n).replace(/ /g, '\\s+')}(?:s|es)?(?![\\w])`, 'i').test(norm(s));
    const cmds = (L.claims || []).filter((c) => c.status === 'PINNED' && c.kind === 'command').map((c) => norm(c.value ?? c.text)).concat((fsn.quickstart_lines || []).map(norm));
    const res = [
      ['does-names-input', has(ans.does, fsn.input_noun), `"does" should mention "${fsn.input_noun}"`],
      ['does-names-output', has(ans.does, fsn.output_noun), `"does" should mention "${fsn.output_noun}"`],
      [waived ? 'audience(waived)' : 'audience', waived || ans.audience.trim().length >= 8, 'audience answer is empty or too short'],
      ['command', cmds.length ? cmds.some((p) => norm(ans.command).includes(p) || p.includes(norm(ans.command)) && norm(ans.command).length > 6) : /^(none|no command|n\/a)/i.test(ans.command.trim()), cmds.length ? `reader's command "${ans.command}" matches no PINNED command` : 'ledger pins no command, so the reader should answer "none"'],
    ];
    for (const [id, ok, why] of res) console.log(`${ok ? 'PASS' : 'FAIL'} ${id}${ok ? '' : ': ' + why}`);
    const bad = res.filter((r) => !r[1]).length;
    console.log(bad ? 'cold-reader: MISMATCH - the first screen does not communicate what the ledger says; rewrite the top and re-run' : 'cold-reader: PASSED');
    process.exit(bad ? 1 : 0);
  } else throw new UsageError('first argument must be pack or check');
} catch (e) {
  if (e instanceof UsageError) { console.error(`cold-reader: ${e.message}\nUsage: node cold-reader-check.mjs pack <readme.md> --out <file> [--lines 40]\n       node cold-reader-check.mjs check <answer.json> <claims.json>`); process.exit(2); }
  throw e;
}
