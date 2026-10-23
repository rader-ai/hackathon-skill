#!/usr/bin/env node
// firstscreen.mjs - the measured first-screen gate. Nine pass/fail checks on the top of the README.
// Usage: node firstscreen.mjs <readme.md> <claims.json> [--lines 40] [--json]
// Reads ledger.first_screen = {input_noun, output_noun, why_claim, no_command_reason?, first_runnable_claim?,
//   output_producer: "code"|"user"|"model"|"mixed", producer_phrase (required unless "code"), quickstart_lines: [..] (may be [])}
// and ledger.visual = {verdict, reason, assets:[{path}], shows:[claim ids the image evidences]}. Exit 0 all pass; 1 any fail; 2 bad input. Node >= 18, no deps.
import {
  UsageError, readText, readJson, loadBanned, norm, parseMarkdown, extractImages, fenceCommands, looksLikeShell, tokens, STOP, GENERIC, isBadgeUrl,
} from './lib.mjs';

const plural = (n) => new RegExp(`(^|[^\\w])${norm(n).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+')}(?:s|es)?(?![\\w])`, 'i');

export function firstScreen({ readme, claims, lines = 40, banned }) {
  const R = []; const add = (id, ok, msg, level) => R.push({ id, ok, msg, level: level || (ok ? 'PASS' : 'FAIL') });
  const text = readText(readme, 'README');
  const L = readJson(claims, 'claims ledger');
  const fs0 = L.first_screen;
  if (!fs0 || !fs0.input_noun || !fs0.output_noun) throw new UsageError('ledger.first_screen needs input_noun and output_noun (see references/first-screen-gate.md)');
  const all = text.split('\n');
  const top = all.slice(0, lines);
  const topText = top.join('\n');
  const pinned = (L.claims || []).filter((c) => c.status === 'PINNED');
  const corpus = norm(pinned.map((c) => `${c.text} ${c.value ?? ''} ${(c.evidence || []).map((e) => e.quote || '').join(' ')}`).join(' '));

  // locate H1 + opener
  const h1i = top.findIndex((l) => /^#\s+\S/.test(l));
  const title = h1i > -1 ? top[h1i].replace(/^#\s+/, '').replace(/[`*_]/g, '').trim() : null;
  let opener = null, openerLine = null;
  for (let i = h1i + 1; i < all.length; i++) {
    const t = all[i].trim();
    if (!t) { if (opener) break; continue; }
    if (/^#{1,6}\s/.test(t) || /^(```|~~~)/.test(t)) { if (opener) break; else break; }
    if (/^!\[|^\[!\[|^<(picture|img|source|p|div|a|br|\/)/i.test(t) || (/^\[/.test(t) && /\]\(.*(shields|badge)/i.test(t))) continue;
    if (/^>/.test(t) && !opener) { opener = t.replace(/^>\s*/, ''); openerLine = i + 1; continue; }
    if (!opener) { opener = t; openerLine = i + 1; } else opener += ' ' + t;
  }
  const sentence = opener ? (opener.match(/^.*?[.!?](?=\s|$)/) || [opener])[0] : null;

  // 1 nouns
  if (!sentence) add('opener-nouns', false, 'no opener paragraph found directly under the H1');
  else {
    const inOk = plural(fs0.input_noun).test(sentence), outOk = plural(fs0.output_noun).test(sentence);
    const gIn = corpus.includes(norm(fs0.input_noun)), gOut = corpus.includes(norm(fs0.output_noun));
    const bad = [!inOk && `input noun "${fs0.input_noun}" missing`, !outOk && `output noun "${fs0.output_noun}" missing`, !gIn && `"${fs0.input_noun}" appears in no PINNED claim`, !gOut && `"${fs0.output_noun}" appears in no PINNED claim`].filter(Boolean);
    add('opener-nouns', !bad.length, bad.length ? `${bad.join('; ')} | first sentence (line ${openerLine}): ${sentence.slice(0, 110)}` : `first sentence names "${fs0.input_noun}" -> "${fs0.output_noun}", both grounded in the ledger`);
  }

  // 2 swap-the-name
  if (sentence) {
    let s = sentence;
    for (const nm of new Set([title, L.repo, ...(title ? title.split(/[\s/]+/) : [])].filter((x) => x && x.length > 2))) s = s.replace(new RegExp(nm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), ' ');
    const toks = tokens(s).filter((t) => t.length >= 3 && !STOP.has(t) && !GENERIC.has(t));
    const grounded = toks.filter((t) => corpus.includes(t));
    const ok = toks.length >= 4 && grounded.length >= 2;
    add('swap-name', ok, ok ? `with the project name removed the sentence still carries ${toks.length} specific words (${grounded.length} found in ledger evidence)` : `with the project name swapped out, only ${toks.length} specific word(s) remain (${grounded.length} grounded in the ledger; need >=4 and >=2). The sentence would be true of many projects.`);
  } else add('swap-name', false, 'no opener to test');

  // 3 banned
  const hits = [];
  const md = parseMarkdown(topText);
  for (const { n, text: t } of md.proseLines) for (const b of banned) if (b.re.test(t)) hits.push(`"${b.word}" (line ${n})`);
  add('no-hype', !hits.length, hits.length ? `hype in the first ${lines} lines: ${hits.join(', ')}` : `no hype words in the first ${lines} lines`);

  // 4 evidence visible
  const imgs = extractImages(md.proseLines).filter((i) => !isBadgeUrl(i.src));
  const assetPaths = (L.visual?.assets || []).map((a) => norm(a.path));
  const goodImg = imgs.find((i) => assetPaths.some((p) => norm(i.src).endsWith(p) || p.endsWith(norm(i.src))));
  const outClaims = pinned.filter((c) => c.kind === 'output').map((c) => norm(c.value ?? c.text));
  const outFence = md.fences.find((f) => !looksLikeShell(f) && outClaims.some((o) => norm(f.lines.map((l) => l.text).join(' ')).includes(o)));
  if (goodImg) add('real-output', true, `captured image from the ledger is visible by line ${goodImg.line}: ${goodImg.src}`);
  else if (outFence) add('real-output', true, `pinned captured output block is visible at line ${outFence.start}`);
  else if (imgs.length) add('real-output', false, `image in the first ${lines} lines (${imgs[0].src}) is not listed in ledger.visual.assets with a capture source`);
  else if (L.visual?.verdict === 'none' && (L.visual.reason || '').length >= 20) add('real-output', true, `no visual in the first screen; ledger verdict "none": ${L.visual.reason}`, 'NOTE');
  else add('real-output', false, `no captured image or pinned output block in the first ${lines} lines, and no "none" verdict with a reason in ledger.visual`);

  // 5 runnable
  const cmdClaims = pinned.filter((c) => c.kind === 'command');
  const cmdVals = cmdClaims.map((c) => norm(c.value ?? c.text));
  let runnable = null;
  const scan = (src) => {
    const m = parseMarkdown(src.join('\n'));
    for (const f of m.fences) {
      if (looksLikeShell(f)) for (const { line, cmd } of fenceCommands(f)) { if (cmdVals.some((p) => norm(cmd) === p || norm(cmd).startsWith(p + ' ') || p.startsWith(norm(cmd) + ' '))) return line; }
      const body = norm(f.lines.map((l) => l.text).join(' '));
      const want = fs0.first_runnable_claim ? cmdClaims.filter((c) => c.id === fs0.first_runnable_claim).map((c) => norm(c.value ?? c.text)) : [];
      if (want.some((w) => body.includes(w))) return f.start;
    }
    return null;
  };
  const inTop = scan(top);
  if (inTop) { runnable = inTop; add('first-command', true, `first pinned runnable command at line ${inTop}`); }
  else {
    const later = scan(all);
    if (!cmdVals.length && fs0.no_command_reason && fs0.no_command_reason.length >= 15) add('first-command', true, `repo has no pinned command; reason: ${fs0.no_command_reason}`, 'NOTE');
    else add('first-command', false, later ? `first pinned command is at line ${later}, past line ${lines}` : `no pinned command in the README${cmdVals.length ? '' : ' (ledger has none; if the repo documents none set first_screen.no_command_reason)'}`);
  }

  // 6 why
  if (fs0.why_claim) {
    const c = pinned.find((x) => x.id === fs0.why_claim);
    if (!c || c.kind !== 'why' || !c.value) add('why-phrase', false, `first_screen.why_claim ${fs0.why_claim} is not a PINNED claim of kind "why" with a value`);
    else add('why-phrase', norm(topText).includes(norm(c.value)), norm(topText).includes(norm(c.value)) ? `the repo's own-words purpose (${c.id}) is in the first ${lines} lines` : `purpose phrase from ${c.id} is not in the first ${lines} lines: "${c.value.slice(0, 80)}"`);
  } else add('why-phrase', !!(fs0.why_none_reason && fs0.why_none_reason.length >= 15), fs0.why_none_reason ? `no why claim; reason: ${fs0.why_none_reason}` : 'first_screen.why_claim is empty and no why_none_reason given', fs0.why_none_reason ? 'NOTE' : 'FAIL');

  // 7 visual-shows: an image must say which ledger rows it evidences, and one of them must support the output noun
  {
    const shows = L.visual?.shows;
    if (!goodImg) add('visual-shows', true, 'no ledger image in the first screen; nothing to evidence', 'NOTE');
    else {
      const ids = Array.isArray(shows) ? shows : [];
      const rows = ids.map((i) => pinned.find((c) => c.id === i)).filter(Boolean);
      const ok = ids.length > 0 && rows.length === ids.length;
      add('visual-shows', ok, ok ? `image evidences ${ids.join(', ')}` : 'ledger.visual.shows must list the PINNED claim ids the image makes visible (at least the row that backs the opener\'s output noun)');
    }
  }

  // 8 producer: who makes the output noun? If not the code, the first screen must say who.
  {
    const prod = fs0.output_producer;
    if (!['code', 'user', 'model', 'mixed'].includes(prod)) add('producer', false, 'first_screen.output_producer must be code, user, model or mixed (who produces the output noun: the tool alone, the user, a model, or a mix?)');
    else if (prod === 'code') add('producer', true, 'the code alone produces the output noun');
    else if (!fs0.producer_phrase || !norm(topText).includes(norm(fs0.producer_phrase))) add('producer', false, `output is produced by "${prod}", so the first ${lines} lines must contain first_screen.producer_phrase (${fs0.producer_phrase ? '"' + fs0.producer_phrase.slice(0, 70) + '"' : 'not set'})`);
    else add('producer', true, `first screen says who produces the output (${prod}): "${fs0.producer_phrase.slice(0, 70)}"`);
  }

  // 9 quickstart: the repo's own clone/install/open lines, in order, in shell fences in the first screen
  {
    const ql = fs0.quickstart_lines;
    if (!Array.isArray(ql)) add('quickstart', false, 'first_screen.quickstart_lines must be an array: the lines the repo\'s own README shows to get from nothing to the first output (clone, cd, install, run, open). Use [] only if the repo shows none.');
    else if (!ql.length) add('quickstart', true, 'repo shows no setup lines; first command stands alone', 'NOTE');
    else {
      const cmds = []; for (const f of parseMarkdown(topText).fences) if (looksLikeShell(f)) for (const { cmd } of fenceCommands(f)) cmds.push(norm(cmd));
      let at = -1; const miss = [];
      for (const q of ql) { const i = cmds.findIndex((c, k) => k > at && c === norm(q)); if (i < 0) miss.push(q); else at = i; }
      add('quickstart', !miss.length, miss.length ? `quickstart line(s) missing or out of order in the first ${lines} lines: ${miss.join(' | ')}` : `all ${ql.length} quickstart lines appear in order`);
    }
  }
  void runnable;
  return R;
}

if (process.argv[1] && process.argv[1].endsWith('firstscreen.mjs')) {
  const a = process.argv.slice(2);
  const oi = a.indexOf('--lines');
  const lines = oi > -1 ? Number(a[oi + 1]) : 40;
  const pos = a.filter((x, i) => !x.startsWith('--') && a[i - 1] !== '--lines');
  try {
    if (pos.length < 2) throw new UsageError('need <readme.md> <claims.json>');
    if (!Number.isInteger(lines) || lines < 10) throw new UsageError('--lines must be an integer >= 10');
    const R = firstScreen({ readme: pos[0], claims: pos[1], lines, banned: loadBanned() });
    if (a.includes('--json')) console.log(JSON.stringify(R, null, 2));
    else { for (const r of R) console.log(`${r.level.padEnd(4)} ${r.id.padEnd(13)} ${r.msg}`); }
    const failed = R.filter((r) => !r.ok).length;
    if (!a.includes('--json')) console.log(failed ? `firstscreen: FAILED ${failed}/${R.length} - fix the opener or the top of the page, then re-run` : `firstscreen: PASSED ${R.length}/${R.length}`);
    process.exit(failed ? 1 : 0);
  } catch (e) {
    if (e instanceof UsageError) { console.error(`firstscreen: ${e.message}\nUsage: node firstscreen.mjs <readme.md> <claims.json> [--lines 40] [--json]`); process.exit(2); }
    throw e;
  }
}
