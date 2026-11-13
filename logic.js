// Pure quiz logic (no DOM). Needs DATA from data.js.
(function (root) {
  "use strict";

  var MAX_PHRASES = 50;
  var DEFAULT_PHRASES = 7;

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Lowercase, trim, collapse whitespace, unify apostrophes.
  // Accents are kept: they are part of the spelling.
  function normalize(s) {
    return String(s)
      .replace(/[‘’ʼ`´]/g, "'")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function shuffle(arr, rnd) {
    rnd = rnd || Math.random;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Split an English phrase into plain-text parts and noun parts
  // ({ text, it }), following the order of the [english, italian] pairs.
  function splitNouns(text, pairs) {
    var parts = [], cursor = 0;
    pairs.forEach(function (pair) {
      var m = new RegExp("\\b" + escapeRegExp(pair[0]) + "\\b").exec(text.slice(cursor));
      if (!m) return;
      var idx = cursor + m.index;
      if (idx > cursor) parts.push({ text: text.slice(cursor, idx) });
      parts.push({ text: text.substr(idx, pair[0].length), it: pair[1] });
      cursor = idx + pair[0].length;
    });
    if (cursor < text.length) parts.push({ text: text.slice(cursor) });
    return parts;
  }

  // Build a phrase from a data entry (data.phrases). subject === null means infinitive.
  function makePhrase(entry, subject, data) {
    var verb = data.verbs[entry.v];
    var ev = entry.ev || verb.en;
    var verbForm, prefix, tag, answer, accepted;
    var alternatives = [];

    if (subject === null) {
      verbForm = entry.v;
      prefix = "to " + ev[0] + " ";
      tag = "Infinitive";
      answer = verbForm + " " + entry.it;
      accepted = [answer];
      (entry.alt || []).forEach(function (a) {
        alternatives.push(a.v + " " + (a.it || entry.it));
      });
    } else {
      verbForm = verb.pres[subject.person];
      var third = subject.person === "lui";
      prefix = subject.en + " " + (third ? ev[1] : ev[0]) + " ";
      tag = "Present tense";
      answer = verbForm + " " + entry.it;
      accepted = [answer];
      subject.pronouns.forEach(function (p) { accepted.push(p + " " + answer); });
      (entry.alt || []).forEach(function (a) {
        var alt = data.verbs[a.v].pres[subject.person] + " " + (a.it || entry.it);
        alternatives.push(alt);
      });
    }
    // Optional alternative answers (entry.alt): other correct Italian
    // renderings of the same English phrase, accepted like the main answer.
    alternatives.forEach(function (alt) {
      accepted.push(alt);
      if (subject !== null) subject.pronouns.forEach(function (p) { accepted.push(p + " " + alt); });
    });

    var parts = [{ text: capitalize(prefix) }].concat(
      splitNouns(entry.en, (data.nouns && data.nouns[entry.en]) || [])
    );

    return {
      // Stable across sessions (progress is stored under it): depends only on
      // the verb, the Italian phrase and the grammatical person.
      id: entry.v + "|" + entry.it + "|" + (subject === null ? "inf" : subject.person),
      verb: entry.v,
      it: entry.it,
      source: entry.v + "|" + entry.it,
      english: parts.map(function (p) { return p.text; }).join(""),
      parts: parts,
      tag: tag,
      answer: answer,
      alternatives: alternatives,
      accepted: accepted.map(normalize)
    };
  }

  // The static list of ALL phrases, built once before any training:
  // for every data entry, one infinitive phrase and one phrase per grammatical
  // person. Subjects sharing a person (he / she) would give identical
  // answers, so they take turns between entries instead of doubling the list.
  function buildAllPhrases(data) {
    data = data || root.DATA;
    var byPerson = [], index = {};
    data.subjects.forEach(function (s) {
      if (!(s.person in index)) { index[s.person] = byPerson.length; byPerson.push([]); }
      byPerson[index[s.person]].push(s);
    });

    var all = [];
    data.phrases.forEach(function (entry, pi) {
      all.push(makePhrase(entry, null, data));
      byPerson.forEach(function (group) {
        all.push(makePhrase(entry, group[pi % group.length], data));
      });
    });
    return all;
  }

  // form: "infinitive" | "present" | "mixed"
  function filterByForm(phrases, form) {
    if (form === "infinitive") return phrases.filter(function (p) { return p.tag === "Infinitive"; });
    if (form === "present") return phrases.filter(function (p) { return p.tag !== "Infinitive"; });
    return phrases.slice();
  }

  // Pick `count` phrases from `pool`. Urgent phrases (e.g. due for a repeat)
  // come first. Within each group the order is random, preferring distinct
  // data entries so a short run does not repeat the same entry.
  function selectPhrases(pool, count, rnd, isUrgent) {
    rnd = rnd || Math.random;
    count = Math.max(1, Math.min(MAX_PHRASES, Math.floor(count) || DEFAULT_PHRASES));

    function spread(list) {
      var seen = {}, first = [], rest = [];
      shuffle(list, rnd).forEach(function (p) {
        if (!seen[p.source]) { seen[p.source] = true; first.push(p); } else { rest.push(p); }
      });
      return first.concat(rest);
    }

    var urgent = [], other = [];
    pool.forEach(function (p) { (isUrgent && isUrgent(p) ? urgent : other).push(p); });
    return spread(urgent).concat(spread(other)).slice(0, count);
  }

  function isCorrect(input, phrase) {
    return phrase.accepted.indexOf(normalize(input)) !== -1;
  }

  // Texts of all usage notes (data.notes) that apply to the phrase's verb and
  // Italian text. Several notes may apply.
  function notesFor(phrase, data) {
    data = data || root.DATA;
    return (data.notes || []).filter(function (n) {
      return n.for.some(function (c) {
        return c.v === phrase.verb && (!c.it || c.it.indexOf(phrase.it) !== -1);
      });
    }).map(function (n) { return n.text; });
  }

  // Articulated prepositions (preposition + definite article) and what they
  // are made of: "dei" = "di + i". Keyed by the Italian form.
  var ARTICLES = ["il", "lo", "l'", "la", "i", "gli", "le"];
  var ARTICULATED = {
    a:  ["al", "allo", "all'", "alla", "ai", "agli", "alle"],
    di: ["del", "dello", "dell'", "della", "dei", "degli", "delle"],
    da: ["dal", "dallo", "dall'", "dalla", "dai", "dagli", "dalle"],
    in: ["nel", "nello", "nell'", "nella", "nei", "negli", "nelle"],
    su: ["sul", "sullo", "sull'", "sulla", "sui", "sugli", "sulle"]
  };
  var BREAKDOWN = {};
  Object.keys(ARTICULATED).forEach(function (prep) {
    ARTICULATED[prep].forEach(function (form, i) {
      BREAKDOWN[form] = prep + " + " + ARTICLES[i];
    });
  });

  // Articulated prepositions used in the phrase's Italian text, in order:
  // [{ form: "dei", parts: "di + i" }]. Empty when it has none.
  function articulatedFor(phrase) {
    var words = phrase.it.toLowerCase().match(/[a-zàèéìòù]+'?/g) || [];
    var seen = {}, found = [];
    words.forEach(function (w) {
      if (BREAKDOWN[w] && !seen[w]) {
        seen[w] = true;
        found.push({ form: w, parts: BREAKDOWN[w] });
      }
    });
    return found;
  }

  // A phrase answered wrongly comes back during the same run: after the next
  // phrase (2 places later), then 2 more times, each 4 places after the
  // previous one. Positions are clamped to the end of the queue. The repeats
  // are copies flagged `repeat: true`; the queue grows by REPEAT_OFFSETS.length.
  var REPEAT_OFFSETS = [2, 6, 10];

  function scheduleRepeats(queue, index) {
    var p = queue[index];
    REPEAT_OFFSETS.forEach(function (offset) {
      queue.splice(Math.min(index + offset, queue.length), 0, Object.assign({}, p, { repeat: true }));
    });
  }

  // The phrase was marked "Learned": cancel its remaining repeats.
  function dropRepeats(queue, index, id) {
    for (var i = queue.length - 1; i > index; i--) {
      if (queue[i].id === id) queue.splice(i, 1);
    }
  }

  // Character-level edit alignment of `typed` against `target`.
  // Returns { cost, ops } where ops is a list of
  //   { kind: "ok",      ch }  typed letter that is right
  //   { kind: "bad",     ch }  typed letter that is wrong or superfluous
  //   { kind: "missing", ch }  letter that should be there but was not typed
  function align(typed, target) {
    var n = typed.length, m = target.length, i, j;
    var d = [];
    for (i = 0; i <= n; i++) {
      d.push([]);
      for (j = 0; j <= m; j++) {
        if (i === 0) d[i][j] = j;
        else if (j === 0) d[i][j] = i;
        else d[i][j] = Math.min(
          d[i - 1][j - 1] + (typed[i - 1] === target[j - 1] ? 0 : 1),
          d[i - 1][j] + 1,
          d[i][j - 1] + 1
        );
      }
    }
    var ops = [];
    i = n; j = m;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && typed[i - 1] === target[j - 1] && d[i][j] === d[i - 1][j - 1]) {
        ops.push({ kind: "ok", ch: typed[i - 1] }); i--; j--;
      } else if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + 1) {
        ops.push({ kind: "bad", ch: typed[i - 1] }); i--; j--;
      } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
        ops.push({ kind: "bad", ch: typed[i - 1] }); i--;
      } else {
        ops.push({ kind: "missing", ch: target[j - 1] }); j--;
      }
    }
    return { cost: d[n][m], ops: ops.reverse() };
  }

  // Compare what the user typed with the closest accepted answer (so that an
  // optional subject pronoun is not counted against the user).
  function diffAnswer(input, phrase) {
    var typed = normalize(input), best = null;
    phrase.accepted.forEach(function (target) {
      var a = align(typed, target);
      if (best === null || a.cost < best.cost) best = a;
    });
    return best.ops;
  }

  function percentage(correct, total) {
    return total === 0 ? 0 : Math.round((correct / total) * 100);
  }

  var Logic = {
    MAX_PHRASES: MAX_PHRASES,
    DEFAULT_PHRASES: DEFAULT_PHRASES,
    normalize: normalize,
    shuffle: shuffle,
    makePhrase: makePhrase,
    buildAllPhrases: buildAllPhrases,
    filterByForm: filterByForm,
    selectPhrases: selectPhrases,
    notesFor: notesFor,
    articulatedFor: articulatedFor,
    REPEAT_OFFSETS: REPEAT_OFFSETS,
    scheduleRepeats: scheduleRepeats,
    dropRepeats: dropRepeats,
    isCorrect: isCorrect,
    diffAnswer: diffAnswer,
    percentage: percentage
  };

  root.Logic = Logic;
  if (typeof module !== "undefined" && module.exports) module.exports = Logic;
})(typeof globalThis !== "undefined" ? globalThis : window);
