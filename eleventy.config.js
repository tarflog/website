module.exports = function (cfg) {
  cfg.addPassthroughCopy({ "assets": "assets" });
  cfg.addPassthroughCopy("CNAME"); // custom domain tarflog.com

  cfg.addFilter("dayNum", (n) => String(n).padStart(4, "0"));
  cfg.addFilter("pad2", (n) => String(n).padStart(2, "0"));
  cfg.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  cfg.addFilter("rssDate", (d) => new Date(d).toUTCString());

  // Журнал: только рассекреченные записи (declassified <= сегодня), новые сверху.
  cfg.addCollection("log", (api) => {
    const now = new Date();
    return api
      .getFilteredByGlob("content/log/*.md")
      .filter((p) => new Date(p.data.declassified) <= now)
      .sort((a, b) => new Date(b.data.declassified) - new Date(a.data.declassified));
  });

  return {
    dir: { input: ".", includes: "_includes", output: "_site" },
    pathPrefix: process.env.PATH_PREFIX || "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
