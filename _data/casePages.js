const fs = require("fs");
const path = require("path");
const cases = require("./cases.json");

const LOG = path.join(__dirname, "..", "content", "log");

const isDeclassified = (slug) => {
  const f = path.join(LOG, `${slug}.md`);
  if (!fs.existsSync(f)) return false;
  const m = fs.readFileSync(f, "utf8").match(/^declassified:\s*(\S+)/m);
  return m ? new Date(m[1]) <= new Date() : false;
};

module.exports = Object.entries(cases)
  .filter(([, c]) => (c.fragments || []).length > 1 || c.retention)
  .filter(([, c]) => (c.fragments || []).some(isDeclassified))
  .map(([key, c]) => ({ key, ...c }));
