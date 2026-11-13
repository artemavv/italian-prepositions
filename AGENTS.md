# Italian Prepositions

The goal of this project is to have a simple training tool to learn Italian prepositions, at A2 level.

## Tech stack

It is deployed as a simple static page using HTML and vanilla JS.

## Tool UI

User sees a "phrase" - combinations of words, with structure "verb + preposition + noun", in English.
User's task is to enter corresponding Italian combination, also using a verb, a preposition, and a noun.
There is a text field to type the answer to, and "Check" button

There is a static list of all phrases (every entry of `phrases` in `data.js` x infinitive/each grammatical person), built once before any training. Each phrase has a stable id (`verb|phrase|person`) so progress survives reloads.

## Tool response to the answer

As soon as user types correct answer, the text field is marked as green immediately, and the "Next" button is shown. There is no auto-advance: the next phrase is shown only when the user clicks "Next" (or marks the phrase).
If user has typed something else and clicked "Check", the text field is replaced by the typed text, marked letter by letter (computed by `Logic.diffAnswer` against the closest accepted answer): correct letters have a green background, incorrect or superfluous letters a red background, missing letters are shown as red underscores. The "Correct answer:" line is shown directly under the marked text, followed by the "Next" button.

After every answer (right or wrong) the user can mark the phrase "Learned" (never offered again) or postpone it to be repeated in 1, 3 or 5 days. Marking goes straight to the next phrase.

Alternative answers (optional): an entry of `phrases` in `data.js` may have `alt: [{ v: verb, it?: phrase }]` (`it` defaults to the entry's own Italian; e.g. `abitare in centro` has `alt: [{ v: "vivere" }]`). The alternatives are conjugated for the phrase's person and accepted like the main answer (with optional subject pronoun). The phrase id, stats and notes stay those of the main phrase. `phrase.answer` is the main answer, `phrase.alternatives` lists the others (empty for most phrases). After a wrong answer the "Correct answer(s):" line lists all of them; the list of phrases and the CSV export show them separated by " / ".

Usage notes: `data.js` has a `notes` list explaining how a specific preposition is used with specific verbs/phrases (e.g. "giocare takes a with sports and games"). Each note has `text` (supports `**bold**` and `*italic*`) and `for`: a list of `{ v: verb, it: [phrases] }` (omit `it` to cover every phrase of the verb). `Logic.notesFor(phrase)` returns all notes that apply, and they are all shown under the result (after the "Check" result, before the marking buttons) after both correct and incorrect answers, each labelled "Note:". Notes appear for every form of the phrase (infinitive and present). Currently every phrase has at least one note, and some have two (e.g. a verb-wide note plus a place note); when adding new phrases, add or extend a note for them too (not enforced by tests). To add a note, add an entry to `notes`; the tests check that every note points at existing verbs/phrases and applies to at least one phrase.

Repeats within a run: when a phrase gets a wrong answer, it is shown again after the next phrase, and 2 more times later in the same run (`Logic.scheduleRepeats`: 2, 6 and 10 places after the missed one, clamped to the end of the run). The run grows by these 3 entries. The repeats happen regardless of whether the answers to them are right or wrong (a wrong answer on a repeat schedules nothing more). If the phrase is marked "Learned", its remaining repeats are cancelled (`Logic.dropRepeats`); postponing does not cancel them. Answers to repeats count for stats, points and the run percentage like any other answer.

If the Italian phrase contains an articulated preposition (al, dei, nella, ...), a small line such as "**dei** = di + i" (`Logic.articulatedFor`) is shown under the result, between the "Next" button and the usage notes, after both correct and incorrect answers.

Hotkeys, active only after the phrase has been answered: `1` / `2` / `3` - postpone for 1 / 3 / 5 days (same order as the buttons), `e` - mark as learned, `Enter` - next phrase. The hints are shown on the buttons.

A "Stop" button on the training screen exits the training immediately (no confirmation, no result screen) and returns to the main screen. Answers given so far stay recorded.

## Points

Each correct answer adds 1 point (wrong answers add nothing). Points are counted per local calendar day; the main screen shows today's points. "Reset progress" also erases points.

## Saved progress

Stored in browser localStorage (key `preposizioni.progress.v1`): per phrase, number of correct / wrong answers, learned flag and due date; plus points per day (`points: {"YYYY-MM-DD": n}`). The page must still work when localStorage is unavailable.

## Before the training run

User picks what to study: all non-learned phrases, only postponed ones, or only those due for a repeat (due ones are asked first). Counts are shown; empty options are disabled. User can also reset all progress, and can open the full list of phrases ("See all phrases": English + Italian answer + status, filterable by status and searchable) before training.

User can enter amount of phrases in the test, or use the default value of 7 phrases.

## After the training run

The tool displays percentage of correct answers, plus overall progress (learned phrases, total correct/wrong answers).

The finish screen has two buttons: "Try again" starts a new run with the same settings (study set, verb form, number of phrases), or goes to the main page if nothing is left to study with them; "Main page" returns to the main screen.

## Running locally

No build step and no dependencies. Either open `index.html` directly in a browser, or serve the folder (closer to production):

```
python3 -m http.server 8000    # then open http://localhost:8000
```

Run the tests (Node.js, no packages needed): `node tests/data.test.js`

After changing `data.js`, `logic.js`, `progress.js`, `app.js` or `style.css`, run `node tools/stamp.js`. It appends a content hash to the script/style links in `index.html` (`app.js?v=1b909429`), so browsers never keep a stale cached copy. The tests fail if the stamps are out of date. Never edit the `?v=` values by hand.

To export all phrases with their answers and notes (plain text) to a CSV file: `node tools/export-csv.js [output.csv]` (default `phrases.csv`; columns: phrase, correct answer, notes - all notes of a phrase in one cell, separated by " | "; UTF-8 with BOM for Excel). It is a generated file, not part of the site.

Files and roles: `data.js` (verbs, phrases, nouns), `logic.js` (phrase list, selection, answer checking), `progress.js` (saved progress), `app.js` (UI), `index.html` + `style.css`. Scripts are loaded in that order by `index.html`; keep it if adding files.

## Deploying

The project is a plain static site: copy these files to any static host (GitHub Pages, Netlify, an nginx/Apache folder, S3, ...), keeping them in the same directory:

`index.html`, `style.css`, `data.js`, `logic.js`, `progress.js`, `app.js`

Do not deploy `tests/`, `tools/` or `AGENTS.md`. Run `node tools/stamp.js` and then the tests before every deploy. No server-side code or configuration is needed; HTTPS is recommended but not required.

Notes:
- Saved progress lives in each visitor's browser localStorage and is tied to the site's origin (protocol + domain + port). Moving the site to a different domain or port starts everyone with empty progress.
- If a change alters how phrase ids are built (`verb|phrase|person` in `logic.js`) or the storage format, bump the key in `progress.js` (`preposizioni.progress.v1`) or add a migration, otherwise old saved progress will not match.
- The `?v=` stamps make browsers refetch any script or stylesheet that changed. `index.html` itself has no stamp, so make sure the host does not cache it for long (most static hosts revalidate it); if a browser still shows an old version, hard-reload once (Ctrl+Shift+R).
