const summarize = (raw, limit = 155) => {
  const text = String(raw || "").replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—-]$/, "") + "…";
};

const caseOf = (cases, slug) => {
  for (const [key, c] of Object.entries(cases || {})) {
    if ((c.fragments || []).includes(slug)) return { key, ...c };
  }
  return null;
};

module.exports = {
  layout: "entry.njk",
  tags: ["logpage"],
  eleventyComputed: {
    caseFile: (data) => caseOf(data.cases, data.page.fileSlug),
    title: (data) => {
      const c = caseOf(data.cases, data.page.fileSlug);
      return c
        ? `${c.subject} — fragment ${data.file}`
        : `Fragment ${data.file} · ${data.rubric}`;
    },
    description: (data) => data.description || summarize(data.page.rawInput),
    permalink: (data) =>
      new Date(data.declassified) <= new Date()
        ? `/log/${data.page.fileSlug}/`
        : false,
    eleventyExcludeFromCollections: (data) =>
      new Date(data.declassified) > new Date()
  }
};
