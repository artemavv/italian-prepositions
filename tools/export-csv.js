// Exports every phrase to a CSV file with three columns: the English phrase,
// the correct Italian answer, and all the usage notes for it as plain text
// (markup removed). When a phrase has several notes they are joined with " | ".
// Opens in Excel / LibreOffice / Google Sheets (UTF-8 with BOM).
//
//   node tools/export-csv.js [output.csv]     (default: phrases.csv in the project root)
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
require(path.join(ROOT, "data.js"));
const Logic = require(path.join(ROOT, "logic.js"));

const plain = (text) => text.replace(/\*\*/g, "").replace(/\*/g, "");
const cell = (s) => (/[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s);

const NOTE_SEPARATOR = " | ";

function buildCsv() {
  const lines = [["Phrase", "Correct answer", "Notes"]].concat(
    Logic.buildAllPhrases().map((p) => [
      p.english,
      [p.answer].concat(p.alternatives).join(" / "),
      Logic.notesFor(p).map(plain).join(NOTE_SEPARATOR)
    ])
  );
  return lines.map((l) => l.map(cell).join(",")).join("\r\n") + "\r\n";
}

module.exports = { buildCsv };

if (require.main === module) {
  const out = path.resolve(process.argv[2] || path.join(ROOT, "phrases.csv"));
  fs.writeFileSync(out, "﻿" + buildCsv(), "utf8");
  console.log("Wrote " + out);
}
