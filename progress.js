// Learning progress: pure state operations plus load/save to a Storage object
// (window.localStorage in the browser). No DOM.
//
// State shape: { v: 1, items: { <phraseId>: { ok, fail, learned, due } },
//                points: { "YYYY-MM-DD": <correct answers that day> } }
//   ok / fail  how many times the phrase was answered correctly / wrongly
//   learned    true -> never offered again
//   due        timestamp (ms) when a postponed phrase is due for a repeat,
//              or null if the phrase was never postponed
(function (root) {
  "use strict";

  var STORAGE_KEY = "preposizioni.progress.v1";
  var DAY_MS = 24 * 60 * 60 * 1000;
  var POSTPONE_DAYS = [1, 3, 5];

  function emptyState() { return { v: 1, items: {}, points: {} }; }

  // Local calendar day of a timestamp, e.g. "2026-11-12".
  function dayKey(ts) {
    var d = new Date(ts);
    var p = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  // Each correct answer is worth one point, counted for the day it was given.
  function addPoint(state, now) {
    var k = dayKey(now);
    state.points[k] = (state.points[k] || 0) + 1;
  }

  function pointsToday(state, now) {
    return state.points[dayKey(now)] || 0;
  }

  function blank() { return { ok: 0, fail: 0, learned: false, due: null }; }

  function get(state, id) {
    return state.items[id] || blank();
  }

  function touch(state, id) {
    if (!state.items[id]) state.items[id] = blank();
    return state.items[id];
  }

  function recordAnswer(state, id, correct) {
    var it = touch(state, id);
    if (correct) it.ok++; else it.fail++;
  }

  function markLearned(state, id) {
    var it = touch(state, id);
    it.learned = true;
    it.due = null;
  }

  function postpone(state, id, days, now) {
    var it = touch(state, id);
    it.learned = false;
    it.due = now + days * DAY_MS;
  }

  function isLearned(item) { return !!item.learned; }
  function isPostponed(item) { return !item.learned && item.due !== null; }
  function isDue(item, now) { return isPostponed(item) && item.due <= now; }

  // mode: "all" (every non-learned phrase) | "postponed" | "due"
  function matches(item, mode, now) {
    if (item.learned) return false;
    if (mode === "postponed") return isPostponed(item);
    if (mode === "due") return isDue(item, now);
    return true;
  }

  function filter(phrases, state, mode, now) {
    return phrases.filter(function (p) { return matches(get(state, p.id), mode, now); });
  }

  function counts(phrases, state, now) {
    var c = { all: 0, postponed: 0, due: 0, learned: 0, total: phrases.length, ok: 0, fail: 0 };
    phrases.forEach(function (p) {
      var it = get(state, p.id);
      c.ok += it.ok;
      c.fail += it.fail;
      if (it.learned) { c.learned++; return; }
      c.all++;
      if (isPostponed(it)) c.postponed++;
      if (isDue(it, now)) c.due++;
    });
    return c;
  }

  // Accept only well-formed data from storage; anything else is dropped.
  function sanitize(raw) {
    var state = emptyState();
    if (!raw || typeof raw !== "object" || !raw.items || typeof raw.items !== "object") return state;
    if (raw.points && typeof raw.points === "object") {
      Object.keys(raw.points).forEach(function (k) {
        var n = raw.points[k];
        if (/^\d{4}-\d{2}-\d{2}$/.test(k) && typeof n === "number" && isFinite(n) && n > 0) {
          state.points[k] = Math.floor(n);
        }
      });
    }
    Object.keys(raw.items).forEach(function (id) {
      var r = raw.items[id];
      if (!r || typeof r !== "object") return;
      var num = function (n) { return typeof n === "number" && isFinite(n) && n >= 0 ? Math.floor(n) : 0; };
      state.items[id] = {
        ok: num(r.ok),
        fail: num(r.fail),
        learned: r.learned === true,
        due: typeof r.due === "number" && isFinite(r.due) ? r.due : null
      };
    });
    return state;
  }

  // Storage can be missing, full or blocked (private mode): never throw.
  function load(storage) {
    try {
      var text = storage && storage.getItem(STORAGE_KEY);
      return text ? sanitize(JSON.parse(text)) : emptyState();
    } catch (e) {
      return emptyState();
    }
  }

  function save(storage, state) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  }

  var Progress = {
    STORAGE_KEY: STORAGE_KEY,
    DAY_MS: DAY_MS,
    POSTPONE_DAYS: POSTPONE_DAYS,
    emptyState: emptyState,
    dayKey: dayKey,
    addPoint: addPoint,
    pointsToday: pointsToday,
    get: get,
    recordAnswer: recordAnswer,
    markLearned: markLearned,
    postpone: postpone,
    isPostponed: isPostponed,
    isDue: isDue,
    isLearned: isLearned,
    filter: filter,
    counts: counts,
    sanitize: sanitize,
    load: load,
    save: save
  };

  root.Progress = Progress;
  if (typeof module !== "undefined" && module.exports) module.exports = Progress;
})(typeof globalThis !== "undefined" ? globalThis : window);
