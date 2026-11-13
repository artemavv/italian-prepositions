// Cache busting for the static page: appends ?v=<hash of the file's content>
// to every local script/stylesheet link in index.html, so a browser never
// keeps serving an old copy of a file that changed.
//
//   node tools/stamp.js     rewrite index.html (run after changing any file)
//
// tests/data.test.js fails when the stamps are out of date.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const LINK = /((?:src|href)=")([^"?:]+\.(?:js|css))(?:\?v=[0-9a-f]*)?(")/g;

function stamp(html, dir) {
  return html.replace(LINK, (all, pre, file, post) => {
    const hash = crypto.createHash("md5").update(fs.readFileSync(path.join(dir, file))).digest("hex").slice(0, 8);
    return `${pre}${file}?v=${hash}${post}`;
  });
}

module.exports = { stamp, ROOT };

if (require.main === module) {
  const file = path.join(ROOT, "index.html");
  const before = fs.readFileSync(file, "utf8");
  const after = stamp(before, ROOT);
  if (after !== before) fs.writeFileSync(file, after);
  console.log(after !== before ? "index.html updated" : "index.html already up to date");
}
