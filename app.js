(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var screens = { start: $("screen-start"), quiz: $("screen-quiz"), result: $("screen-result"), list: $("screen-list") };
  var els = {
    startForm: $("start-form"), count: $("count"), start: $("start"), reset: $("reset"),
    overview: $("overview"), startNote: $("start-note"), todayPoints: $("today-points"), stop: $("stop"),
    progress: $("progress"), tag: $("tag"), phrase: $("phrase"), hint: $("hint"),
    answerForm: $("answer-form"), answer: $("answer"), accents: $("accents"),
    review: $("review"), marked: $("marked"), correctLine: $("correct-line"),
    showList: $("show-list"), listBack: $("list-back"), listFilter: $("list-filter"),
    listSearch: $("list-search"), listBody: $("list-body"), listCount: $("list-count"),
    check: $("check"), next: $("next"), feedback: $("feedback"),
    mark: $("mark"), markStatus: $("mark-status"), notes: $("notes"), prepNote: $("prep-note"),
    score: $("score"), scoreDetail: $("score-detail"), scoreOverall: $("score-overall"),
    restart: $("restart"), mainPage: $("main-page")
  };

  var HINTS = {
    "Infinitive": "Use the infinitive, then the preposition (with the article if Italian has one) and the noun.",
    "Present tense": "Conjugate the verb for the subject. The subject pronoun is not required."
  };

  // The static list of all phrases, built once, before any training.
  var ALL = Logic.buildAllPhrases();

  // Saved progress. localStorage may be unavailable (private mode, blocked
  // site data): the trainer still works, it just cannot remember anything.
  var store = null;
  try { store = window.localStorage; } catch (e) { store = null; }
  var progress = Progress.load(store);
  var storageOk = store !== null;

  var state = { phrases: [], index: 0, correct: 0, answered: false };

  function persist() {
    if (!Progress.save(store, progress)) storageOk = false;
  }

  function show(name) {
    Object.keys(screens).forEach(function (k) { screens[k].hidden = (k !== name); });
  }

  function setFeedback(html, cls) {
    els.feedback.className = "feedback" + (cls ? " " + cls : "");
    els.feedback.innerHTML = html;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Note texts use **bold** and *italic*; everything else is plain text.
  function noteHtml(text) {
    return escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");
  }

  // Usage notes for the phrase, shown after the answer (right or wrong).
  function renderNotes(p) {
    var notes = Logic.notesFor(p);
    els.notes.innerHTML = notes.map(function (t) {
      return '<p class="note"><span class="note-label">Note:</span> ' + noteHtml(t) + "</p>";
    }).join("");
    els.notes.hidden = notes.length === 0;
  }

  // Small reminder of what an articulated preposition in the phrase is made
  // of ("dei = di + i"), shown after the answer, above the usage notes.
  function renderPrepNote(p) {
    var found = Logic.articulatedFor(p);
    els.prepNote.innerHTML = found.map(function (f) {
      return "<strong>" + escapeHtml(f.form) + "</strong> = " + escapeHtml(f.parts);
    }).join(" · ");
    els.prepNote.hidden = found.length === 0;
  }

  function plural(n, word) { return n + " " + word + (n === 1 ? "" : "s"); }

  function overallText() {
    var c = Progress.counts(ALL, progress, Date.now());
    var text = "Learned " + c.learned + " of " + c.total + " phrases · " +
      plural(c.ok, "correct answer") + ", " + plural(c.fail, "mistake") + " in total.";
    if (!storageOk) text += " Progress cannot be saved in this browser.";
    return text;
  }

  // ---- Start screen ----

  var SET_LABELS = { all: "n-all", postponed: "n-postponed", due: "n-due" };

  // Refresh the counts next to the study options and keep the form consistent.
  function refreshStart() {
    var now = Date.now();
    var form = els.startForm.elements.mode.value;
    var c = Progress.counts(Logic.filterByForm(ALL, form), progress, now);
    var radios = els.startForm.elements.set;

    var firstEnabled = null;
    Array.prototype.forEach.call(radios, function (r) {
      var n = c[r.value];
      $(SET_LABELS[r.value]).textContent = "(" + n + ")";
      r.disabled = n === 0;
      r.parentNode.classList.toggle("empty", n === 0);
      if (n > 0 && firstEnabled === null) firstEnabled = r;
    });

    var selected = radios.value;
    if (!selected || c[selected] === 0) {
      if (firstEnabled) firstEnabled.checked = true;
      selected = firstEnabled ? firstEnabled.value : "";
    }

    var available = selected ? c[selected] : 0;
    els.count.max = Math.max(1, Math.min(Logic.MAX_PHRASES, available));
    var raw = parseInt(els.count.value, 10);
    if (!isNaN(raw) && raw > Number(els.count.max)) els.count.value = els.count.max;

    els.start.disabled = available === 0;
    els.startNote.textContent = available === 0
      ? "Nothing to study here: every phrase of this verb form is learned."
      : "";
    els.overview.textContent = overallText();
    els.todayPoints.textContent = Progress.pointsToday(progress, Date.now());
  }

  function startQuiz() {
    var now = Date.now();
    var setMode = els.startForm.elements.set.value;
    var form = els.startForm.elements.mode.value;
    var pool = Progress.filter(Logic.filterByForm(ALL, form), progress, setMode, now);
    if (pool.length === 0) return false;

    var raw = parseInt(els.count.value, 10);
    var count = isNaN(raw) ? Logic.DEFAULT_PHRASES : Math.max(1, Math.min(Logic.MAX_PHRASES, raw));
    count = Math.min(count, pool.length);
    els.count.value = count;

    // Phrases that are due for a repeat go first.
    state.phrases = Logic.selectPhrases(pool, count, null, function (p) {
      return Progress.isDue(Progress.get(progress, p.id), now);
    });
    state.index = 0;
    state.correct = 0;
    show("quiz");
    showPhrase();
    return true;
  }

  // ---- Quiz screen ----

  // Render the English phrase. Each noun is a button; clicking it toggles
  // its Italian translation right after it.
  function renderPhrase(p) {
    els.phrase.textContent = "";
    p.parts.forEach(function (part) {
      if (!part.it) {
        els.phrase.appendChild(document.createTextNode(part.text));
        return;
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "noun";
      btn.textContent = part.text;
      btn.setAttribute("aria-expanded", "false");
      btn.title = "Click to see this noun in Italian";

      var gloss = document.createElement("span");
      gloss.className = "gloss";
      gloss.textContent = " → " + part.it;
      gloss.hidden = true;

      btn.addEventListener("click", function () {
        gloss.hidden = !gloss.hidden;
        btn.setAttribute("aria-expanded", String(!gloss.hidden));
      });
      els.phrase.appendChild(btn);
      els.phrase.appendChild(gloss);
    });
  }

  // "3 / 9" and the Next/Finish label. The queue grows when a wrong answer
  // schedules repeats, so this is refreshed then too.
  function updateCounter() {
    els.progress.textContent = (state.index + 1) + " / " + state.phrases.length;
    els.next.textContent = (state.index === state.phrases.length - 1) ? "Finish" : "Next";
  }

  function showPhrase() {
    var p = state.phrases[state.index];
    state.answered = false;

    updateCounter();
    var infinitive = p.tag === "Infinitive";
    els.tag.textContent = infinitive ? "modo Infinito" : "tempo Presente";
    els.tag.className = "tag " + (infinitive ? "infinitive" : "present");
    renderPhrase(p);
    els.hint.textContent = HINTS[p.tag];

    els.answer.value = "";
    els.answer.hidden = false;
    els.accents.hidden = false;
    els.review.hidden = true;
    els.answer.readOnly = false;
    els.answer.className = "";
    els.check.hidden = false;
    els.check.disabled = false;
    els.next.hidden = true;
    els.mark.hidden = true;
    els.notes.hidden = true;
    els.prepNote.hidden = true;
    setFeedback("");
    els.answer.focus();
  }

  function statusText(p) {
    var it = Progress.get(progress, p.id);
    var text = plural(it.ok, "correct answer") + ", " + plural(it.fail, "mistake") + " so far.";
    if (Progress.isPostponed(it)) {
      text += Progress.isDue(it, Date.now())
        ? " Due for a repeat."
        : " Postponed until " + new Date(it.due).toLocaleDateString() + ".";
    }
    return text;
  }

  // After an answer (right or wrong): record it and offer the marks.
  function afterAnswer(correct) {
    var p = state.phrases[state.index];
    state.answered = true;
    Progress.recordAnswer(progress, p.id, correct);
    // A wrong answer brings the phrase back later in this run (repeats
    // themselves do not schedule more repeats).
    if (!correct && !p.repeat) {
      Logic.scheduleRepeats(state.phrases, state.index);
      updateCounter();
    }
    if (correct) Progress.addPoint(progress, Date.now());
    persist();
    els.markStatus.textContent = statusText(p);
    renderPrepNote(p);
    renderNotes(p);
    els.mark.hidden = false;
  }

  function markCorrect() {
    state.correct++;
    els.answer.className = "correct";
    els.answer.readOnly = true;
    els.check.hidden = true;
    els.next.hidden = false;
    setFeedback("Corretto!", "ok");
    afterAnswer(true);
    els.next.focus();
  }

  // Replace the text field by the typed text, letter by letter: right letters
  // green, wrong or superfluous ones red, missing ones as a red underscore.
  function renderReview(typed, p) {
    els.marked.textContent = "";
    var shown = [];
    Logic.diffAnswer(typed, p).forEach(function (op) {
      var span = document.createElement("span");
      span.className = op.kind;
      span.textContent = op.kind === "missing" ? "_" : op.ch;
      els.marked.appendChild(span);
      if (op.kind !== "missing") shown.push(op.ch);
    });
    els.marked.setAttribute("role", "img");
    els.marked.setAttribute("aria-label", "Your answer: " + shown.join(""));
    els.correctLine.innerHTML = (p.alternatives.length ? "Correct answers: " : "Correct answer: ") +
      [p.answer].concat(p.alternatives).map(function (t) {
        return "<strong>" + escapeHtml(t) + "</strong>";
      }).join(" or ");
  }

  function markWrong() {
    var p = state.phrases[state.index];
    renderReview(els.answer.value, p);
    els.answer.hidden = true;
    els.accents.hidden = true;
    els.review.hidden = false;
    els.check.hidden = true;
    els.next.hidden = false;
    setFeedback("");
    afterAnswer(false);
    els.next.focus();
  }

  function advance() {
    state.index++;
    if (state.index >= state.phrases.length) {
      showResult();
    } else {
      showPhrase();
    }
  }

  function showResult() {
    var total = state.phrases.length;
    els.score.textContent = Logic.percentage(state.correct, total) + "%";
    els.scoreDetail.textContent = state.correct + " of " + total + " correct";
    els.scoreOverall.textContent = overallText();
    show("result");
    els.restart.focus();
  }

  // ---- Events ----

  // Green immediately as soon as the typed text is a correct answer.
  els.answer.addEventListener("input", function () {
    if (state.answered) return;
    if (Logic.isCorrect(els.answer.value, state.phrases[state.index])) markCorrect();
  });

  // "Check" button / Enter key.
  els.answerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (state.answered) return;
    var value = els.answer.value;
    if (Logic.normalize(value) === "") {
      setFeedback("Type your answer first.", "bad");
      return;
    }
    if (Logic.isCorrect(value, state.phrases[state.index])) markCorrect();
    else markWrong();
  });

  // Learned / postpone buttons: apply, save and go straight to the next phrase.
  function applyMark(days) {   // days === null: learned
    var id = state.phrases[state.index].id;
    if (days === null) {
      Progress.markLearned(progress, id);
      Logic.dropRepeats(state.phrases, state.index, id);
    } else Progress.postpone(progress, id, days, Date.now());
    persist();
    advance();
  }

  els.mark.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-action]");
    if (!btn || !state.answered) return;
    applyMark(btn.dataset.action === "learned" ? null : Number(btn.dataset.days));
  });

  // Hotkeys, available once the phrase has been answered.
  // 1 / 2 / 3: repeat in 1 / 3 / 5 days (same order as the buttons),
  // E: learned, Enter: next phrase.
  var HOTKEY_DAYS = { "1": 1, "2": 3, "3": 5 };
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    if (screens.quiz.hidden || !state.answered) return;
    var key = e.key.toLowerCase();
    if (key === "enter") {
      // A focused button handles Enter itself (e.g. "Next").
      if (e.target.closest && e.target.closest("button")) return;
      e.preventDefault();
      advance();
    } else if (key === "e") {
      e.preventDefault();
      applyMark(null);
    } else if (HOTKEY_DAYS[key]) {
      e.preventDefault();
      applyMark(HOTKEY_DAYS[key]);
    }
  });

  // Accent buttons: insert the letter at the cursor position. mousedown is
  // prevented so the text field keeps focus (and the cursor) on desktop.
  var accents = els.accents;
  accents.addEventListener("mousedown", function (e) { e.preventDefault(); });
  // Same for the noun buttons in the phrase.
  els.phrase.addEventListener("mousedown", function (e) { e.preventDefault(); });
  accents.addEventListener("click", function (e) {
    var btn = e.target.closest("button.accent");
    if (!btn || state.answered) return;
    var input = els.answer;
    var start = input.selectionStart, end = input.selectionEnd;
    input.focus();
    input.setRangeText(btn.textContent, start, end, "end");
    // Run the same instant-correct check as normal typing.
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

  els.next.addEventListener("click", advance);

  // Stop: leave the training at once and go back to the main screen. Answers
  // given so far are already saved.
  els.stop.addEventListener("click", function () {
    state.answered = false;
    refreshStart();
    show("start");
    els.start.focus();
  });

  els.startForm.addEventListener("change", function (e) {
    if (e.target.type === "radio") refreshStart();
  });

  els.startForm.addEventListener("submit", function (e) {
    e.preventDefault();
    startQuiz();
  });

  els.reset.addEventListener("click", function () {
    if (!window.confirm("Erase all saved progress (learned phrases, postponed phrases, statistics and points)?")) return;
    progress = Progress.emptyState();
    persist();
    refreshStart();
  });

  function goToMainPage() {
    refreshStart();
    show("start");
    els.start.focus();
  }

  // "Try again": a new run with the same settings (study set, verb form and
  // number of phrases). If nothing is left to study with them (e.g. the chosen
  // set is now empty), go to the main page instead.
  els.restart.addEventListener("click", function () {
    var setBefore = els.startForm.elements.set.value;
    refreshStart();   // may switch the set when the chosen one is empty
    if (els.startForm.elements.set.value !== setBefore || !startQuiz()) goToMainPage();
  });

  els.mainPage.addEventListener("click", goToMainPage);

  // ---- Full list of phrases ----

  function statusLabel(it, now) {
    if (it.learned) return "Learned";
    if (Progress.isDue(it, now)) return "Due";
    if (Progress.isPostponed(it)) return "Postponed until " + new Date(it.due).toLocaleDateString();
    return "";
  }

  function allAnswers(p) {
    return [p.answer].concat(p.alternatives);
  }

  function renderList() {
    var now = Date.now();
    var which = els.listFilter.value;
    var q = Logic.normalize(els.listSearch.value);
    var rows = ALL.filter(function (p) {
      var it = Progress.get(progress, p.id);
      if (which === "learned" ? !it.learned : which !== "everything" && !Progress.filter([p], progress, which, now).length) return false;
      return !q || Logic.normalize(p.english).indexOf(q) !== -1 || allAnswers(p).some(function (t) { return Logic.normalize(t).indexOf(q) !== -1; });
    });

    var frag = document.createDocumentFragment();
    rows.forEach(function (p) {
      var tr = document.createElement("tr");
      [p.english, allAnswers(p).join(" / ")].forEach(function (text) {
        var td = document.createElement("td");
        td.textContent = text;
        tr.appendChild(td);
      });
      var st = document.createElement("td");
      st.className = "st";
      st.textContent = statusLabel(Progress.get(progress, p.id), now);
      tr.appendChild(st);
      frag.appendChild(tr);
    });
    els.listBody.textContent = "";
    els.listBody.appendChild(frag);
    els.listCount.textContent = "Showing " + rows.length + " of " + ALL.length;
  }

  els.showList.addEventListener("click", function () {
    renderList();
    show("list");
    window.scrollTo(0, 0);
  });
  els.listFilter.addEventListener("change", renderList);
  els.listSearch.addEventListener("input", renderList);
  els.listBack.addEventListener("click", function () {
    refreshStart();
    show("start");
    els.showList.focus();
  });

  refreshStart();
})();
