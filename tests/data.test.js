// Data and logic checks. Run with: node tests/data.test.js
const assert = require("assert");
const path = require("path");
require(path.join(__dirname, "..", "data.js"));
const L = require(path.join(__dirname, "..", "logic.js"));
const D = globalThis.DATA;
const problems = [];
const fail = (msg) => problems.push(msg);

// Verbs: all six present-tense forms, English forms present.
const personKeys = ["io", "tu", "lui", "noi", "voi", "loro"];
for (const [k, v] of Object.entries(D.verbs)) {
  for (const p of personKeys) if (!v.pres[p]) fail(`verb ${k} lacks ${p}`);
  if (!v.en || v.en.length !== 2) fail(`verb ${k} lacks English forms`);
}

for (const p of D.phrases) {
  if (!D.verbs[p.v]) fail(`phrase "${p.it}" uses unknown verb ${p.v}`);

  // Nouns: entry exists, every noun found in the English phrase and
  // contained in the Italian phrase.
  const pairs = D.nouns[p.en];
  if (!pairs) { fail(`no noun entry for "${p.en}"`); continue; }
  const phrase = L.makePhrase(p, null, D);
  const found = phrase.parts.filter((x) => x.it);
  if (found.length !== pairs.length) fail(`not all nouns found in "${p.en}"`);
  for (const f of found)
    if (!p.it.toLowerCase().includes(f.it.toLowerCase()))
      fail(`noun "${f.it}" is not in "${p.it}"`);

  // Possessives in English must appear in Italian.
  if (/\b(my|your|his|her|our|their)\b/.test(p.en) &&
      !/\b(mi[oae]|miei|mie|tu[oae]|tuoi|tue|su[oae]|suoi|sue|nostr[oiae]|vostr[oiae]|lor[oae])\b/.test(p.it))
    fail(`"${p.en}" has a possessive but "${p.it}" does not`);
}
const usedEn = new Set(D.phrases.map((p) => p.en));
for (const k of Object.keys(D.nouns)) if (!usedEn.has(k)) fail(`unused noun key "${k}"`);

// Every articulated preposition form appears in at least one phrase.
const articulated = {
  a:  ["al", "allo", "all'", "alla", "ai", "agli", "alle"],
  di: ["del", "dello", "dell'", "della", "dei", "degli", "delle"],
  da: ["dal", "dallo", "dall'", "dalla", "dai", "dagli", "dalle"],
  in: ["nel", "nello", "nell'", "nella", "nei", "negli", "nelle"],
  su: ["sul", "sullo", "sull'", "sulla", "sui", "sugli", "sulle"]
};
const words = new Set();
for (const p of D.phrases)
  (p.it.toLowerCase().match(/[a-zàèéìòù]+'?/g) || []).forEach((w) => words.add(w));
for (const forms of Object.values(articulated))
  for (const f of forms) if (!words.has(f)) fail(`articulated form "${f}" is not used`);

// The static list: stable unique ids, same list on every build, no duplicate answers.
const all = L.buildAllPhrases(D);
const again = L.buildAllPhrases(D);
assert.deepStrictEqual(all.map((p) => p.id), again.map((p) => p.id));
assert.strictEqual(new Set(all.map((p) => p.id)).size, all.length);
const persons = new Set(D.subjects.map((s) => s.person)).size;
assert.strictEqual(all.length, D.phrases.length * (1 + persons));
assert.strictEqual(new Set(all.map((p) => p.english + "|" + p.answer)).size, all.length);
assert.strictEqual(L.filterByForm(all, "infinitive").length, D.phrases.length);
assert.strictEqual(L.filterByForm(all, "present").length, D.phrases.length * persons);

// Alternative answers (optional `alt` on a phrase): other verbs/phrases accepted for the same phrase.
for (const p of D.phrases) for (const a of p.alt || []) {
  if (!D.verbs[a.v]) fail(`alt of "${p.v} ${p.it}" uses unknown verb ${a.v}`);
  else if (a.v === p.v && (!a.it || a.it === p.it)) fail(`alt of "${p.v} ${p.it}" equals the main answer`);
}
const centro = (person) => all.find((p) => p.verb === "abitare" && p.it === "in centro" && (person ? p.id.endsWith("|" + person) : p.tag === "Infinitive"));
assert.ok(L.isCorrect("abiti in centro", centro("tu")) && L.isCorrect("vivi in centro", centro("tu")));
assert.ok(L.isCorrect("tu vivi in centro", centro("tu")));
assert.ok(L.isCorrect("vivere in centro", centro(null)) && L.isCorrect("abitare in centro", centro(null)));
assert.ok(!L.isCorrect("vivo in centro", centro("tu")));
assert.deepStrictEqual(centro("tu").alternatives, ["vivi in centro"]);
assert.strictEqual(centro("tu").answer, "abiti in centro");
assert.deepStrictEqual(all.find((p) => p.verb === "andare").alternatives, []);   // alternatives are optional
assert.ok(L.diffAnswer("vivi in centrp", centro("tu")).filter((o) => o.kind !== "ok").length === 1); // diff against the closest one

// Selecting: right size, no duplicates, urgent phrases first.
const urgent = new Set(all.slice(0, 5).map((p) => p.id));
const picked = L.selectPhrases(all, 10, Math.random, (p) => urgent.has(p.id));
assert.strictEqual(picked.length, 10);
assert.strictEqual(new Set(picked.map((p) => p.id)).size, 10);
assert.ok(picked.slice(0, 5).every((p) => urgent.has(p.id)));
assert.strictEqual(L.selectPhrases(all.slice(0, 3), 10).length, 3);

// Usage notes: every note refers to existing verbs/phrases and applies to at least one phrase.
for (const n of D.notes) {
  if (!n.text || !n.for || !n.for.length) fail("note without text or targets: " + n.text);
  for (const c of n.for) {
    if (!D.verbs[c.v]) fail(`note targets unknown verb ${c.v}`);
    for (const it of c.it || [])
      if (!D.phrases.some((p) => p.v === c.v && p.it === it)) fail(`note targets unknown phrase "${c.v} ${it}"`);
    if (c.it && c.it.length === 0) fail(`note for ${c.v} has an empty phrase list`);
  }
  if (!all.some((p) => L.notesFor(p, D).includes(n.text))) fail("note applies to no phrase: " + n.text);
  const plain = n.text.replace(/\*\*/g, "");
  if ((n.text.split("**").length - 1) % 2 || (plain.split("*").length - 1) % 2) fail("unbalanced markup in note: " + n.text);
}
const notesOf = (verb, it) => L.notesFor(all.find((p) => p.verb === verb && p.it === it), D);
assert.strictEqual(notesOf("giocare", "a calcio").length, 1);
assert.ok(notesOf("giocare", "a calcio")[0].includes("giocare"));
assert.ok(notesOf("giocare", "nel parco")[0].includes("nel parco")); // in + article for a specific place
assert.ok(!notesOf("giocare", "nel parco")[0].includes("giocare")); // not the sports note
assert.strictEqual(notesOf("andare", "al cinema").length, 1);
assert.strictEqual(notesOf("pensare", "al futuro").length, 1);       // verb-wide note
assert.strictEqual(notesOf("salire", "sul treno").length, 1);
assert.strictEqual(notesOf("tornare", "dal lavoro").length, 1);
assert.strictEqual(notesOf("tornare", "a casa").length, 2);          // tornare note + casa note
assert.strictEqual(notesOf("aspettare", "un amico alla stazione").length, 2);
assert.ok(notesOf("uscire", "di casa").length === 1 && notesOf("uscire", "di casa")[0].includes("di casa"));
assert.ok(notesOf("aspettare", "l'autobus alla fermata").some((t) => t.includes("wait")));
// Several notes on one phrase, and notes follow the phrase in every form.
const multi = { notes: [{ text: "x", for: [{ v: "a" }] }, { text: "y", for: [{ v: "a", it: ["z"] }] }, { text: "n", for: [{ v: "b" }] }] };
assert.deepStrictEqual(L.notesFor({ verb: "a", it: "z" }, multi), ["x", "y"]);
assert.deepStrictEqual(L.notesFor({ verb: "a", it: "q" }, multi), ["x"]);
assert.deepStrictEqual(L.notesFor({ verb: "c", it: "q" }, multi), []);
assert.strictEqual(all.filter((p) => p.verb === "pensare" && p.it === "al futuro").every((p) => L.notesFor(p, D).length === 1), true);

// Articulated prepositions are explained: "dei" = "di + i".
const prep = (verb, it) => L.articulatedFor(all.find((p) => p.verb === verb && p.it === it)).map((x) => x.form + "=" + x.parts).join();
assert.strictEqual(prep("parlare", "dei problemi"), "dei=di + i");
assert.strictEqual(prep("venire", "alla festa"), "alla=a + la");
assert.strictEqual(prep("giocare", "nel parco"), "nel=in + il");
assert.strictEqual(prep("uscire", "dall'ufficio"), "dall'=da + l'");
assert.strictEqual(prep("parlare", "di lavoro"), "");
assert.strictEqual(prep("partire", "alle otto"), "alle=a + le");
for (const p of D.phrases) { // every articulated form in the phrases is covered
  const words = p.it.toLowerCase().match(/[a-zàèéìòù]+'?/g) || [];
  const phrase = all.find((x) => x.verb === p.v && x.it === p.it);
  if (L.articulatedFor(phrase).length !== new Set(words.filter((w) => Object.values(articulated).some((f) => f.includes(w)))).size) fail(`articulated forms not explained in "${p.it}"`);
}

// Every phrase with an apostrophe has a note that explains it.
for (const p of D.phrases.filter((x) => x.it.includes("'"))) {
  const phrase = all.find((x) => x.verb === p.v && x.it === p.it);
  if (!L.notesFor(phrase, D).some((n) => n.includes("apostrophe"))) fail(`no apostrophe note for "${p.v} ${p.it}"`);
}

// Repeats of a wrongly answered phrase.
const q = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n"].map((id) => ({ id }));
L.scheduleRepeats(q, 0);                       // "a" wrong
assert.deepStrictEqual(q.map((x) => x.id + (x.repeat ? "*" : "")).join(""), "aba*cdea*fgha*ijklmn");
assert.deepStrictEqual(q.map((x) => x.repeat ? 1 : 0).reduce((s, v) => s + v, 0), 3);
L.dropRepeats(q, 0, "a");                      // "a" learned
assert.deepStrictEqual(q.map((x) => x.id).join(""), "abcdefghijklmn");
const q2 = [{ id: "x" }, { id: "y" }];
L.scheduleRepeats(q2, 1);                      // last phrase wrong: repeats go to the end
assert.deepStrictEqual(q2.map((x) => x.id).join(""), "xyyyy");
L.dropRepeats(q2, 3, "y");                     // learned on the 2nd repeat: only the later one goes
assert.deepStrictEqual(q2.map((x) => x.id).join(""), "xyyy");
assert.ok(q2[2].repeat && q2[3].repeat && !q2[1].repeat);

// diffAnswer: per-letter marks against the closest accepted answer.
const fake = { accepted: ["va al cinema", "lui va al cinema"] };
const kinds = (typed) => L.diffAnswer(typed, fake).map((o) => o.kind);
const count = (arr, k) => arr.filter((x) => x === k).length;
let ops = L.diffAnswer("Ve al  cinma", fake);   // case and spaces are normalised
assert.strictEqual(ops.filter((o) => o.kind !== "missing").map((o) => o.ch).join(""), "ve al cinma");
assert.deepStrictEqual([count(kinds("ve al cinma"), "ok"), count(kinds("ve al cinma"), "bad"), count(kinds("ve al cinma"), "missing")], [10, 1, 1]);
assert.deepStrictEqual(kinds("va al cinema").filter((k) => k !== "ok"), []);
assert.strictEqual(count(kinds("va al cinemaa"), "bad"), 1);          // superfluous letter
assert.strictEqual(count(kinds("va"), "missing"), 10);                 // short answer
assert.strictEqual(count(kinds("lui va al cinma"), "missing"), 1);     // pronoun variant is not penalised
assert.strictEqual(count(kinds("lui va al cinma"), "bad"), 0);
assert.strictEqual(count(kinds("da"), "ok") + count(kinds("da"), "bad"), 2);
assert.strictEqual(L.diffAnswer("a", { accepted: ["dà"] }).map((o) => o.kind + o.ch).join(), "missingd,bada");

// Progress: marks, filters, counts, storage.
const P = require(path.join(__dirname, "..", "progress.js"));
const NOW = 1_000_000_000_000;
const [a, b, c, d] = all;
const st = P.emptyState();
P.recordAnswer(st, a.id, true);
P.recordAnswer(st, a.id, false);
P.markLearned(st, a.id);
P.postpone(st, b.id, 1, NOW - 2 * P.DAY_MS); // overdue
P.postpone(st, c.id, 3, NOW);              // not due yet
const ids = (mode) => P.filter(all, st, mode, NOW).map((p) => p.id);
assert.ok(!ids("all").includes(a.id));     // learned: never offered
assert.strictEqual(ids("all").length, all.length - 1);
assert.deepStrictEqual(ids("postponed"), [b.id, c.id]);
assert.deepStrictEqual(ids("due"), [b.id]);
assert.deepStrictEqual(ids("due").concat(P.filter(all, st, "due", NOW + 3 * P.DAY_MS).map((p) => p.id)).sort(),
  [b.id, b.id, c.id].sort());
P.postpone(st, a.id, 5, NOW);              // postponing un-learns
assert.ok(ids("all").includes(a.id));
P.markLearned(st, b.id);                   // learning clears the postponement
assert.strictEqual(P.get(st, b.id).due, null);
const cnt = P.counts(all, st, NOW);
assert.deepStrictEqual([cnt.learned, cnt.postponed, cnt.due, cnt.ok, cnt.fail], [1, 2, 0, 1, 1]);

// Points: one per correct answer, counted per local day.
const pts = P.emptyState();
const T0 = new Date(2026, 10, 12, 23, 59).getTime();      // 12 Nov, one minute before midnight
P.addPoint(pts, T0); P.addPoint(pts, T0);
P.addPoint(pts, T0 + 2 * 60 * 1000);                       // 13 Nov
assert.strictEqual(P.dayKey(T0), "2026-11-12");
assert.strictEqual(P.pointsToday(pts, T0), 2);
assert.strictEqual(P.pointsToday(pts, T0 + 2 * 60 * 1000), 1);
assert.strictEqual(P.pointsToday(pts, T0 + 3 * P.DAY_MS), 0);
assert.deepStrictEqual(P.sanitize(JSON.parse(JSON.stringify(pts))).points, pts.points);
assert.deepStrictEqual(P.sanitize({ items: {} }).points, {});   // saved by the previous version
assert.deepStrictEqual(P.sanitize({ items: {}, points: { bad: 5, "2026-01-01": -2, "2026-01-02": "x", "2026-01-03": 4 } }).points, { "2026-01-03": 4 });

const mem = { data: {}, getItem(k) { return k in this.data ? this.data[k] : null; }, setItem(k, v) { this.data[k] = v; } };
assert.ok(P.save(mem, st));
assert.deepStrictEqual(P.load(mem), st);
mem.data[P.STORAGE_KEY] = "{broken";
assert.deepStrictEqual(P.load(mem), P.emptyState());
assert.deepStrictEqual(P.sanitize({ items: { x: { ok: -3, due: "soon", learned: 1 } } }).items.x,
  { ok: 0, fail: 0, learned: false, due: null });
assert.strictEqual(P.save({ setItem() { throw new Error("quota"); } }, st), false);
assert.deepStrictEqual(P.load(null), P.emptyState());

// Cache busting: index.html links must carry the current content hashes.
{
  const fs = require("fs");
  const { stamp, ROOT } = require(path.join(__dirname, "..", "tools", "stamp.js"));
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  if (stamp(html, ROOT) !== html) fail("index.html has stale ?v= stamps: run `node tools/stamp.js`");
  if ((html.match(/\?v=[0-9a-f]{8}"/g) || []).length < 5) fail("index.html: scripts/styles lack ?v= stamps");
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`OK: ${Object.keys(D.verbs).length} verbs, ${D.phrases.length} phrases, 35 articulated forms covered`);
