const fs = require("node:fs");
const path = require("node:path");

const IMAGE_CACHE = ".image-cache";
const IMAGE_PATH = "assets/gen";
const IMAGE_FORMATS = ["webp", "jpeg"];
const IMAGE_QUALITY = {
  sharpWebpOptions: { quality: 76 },
  sharpJpegOptions: { quality: 78, mozjpeg: true }
};

const CSS_BACKGROUNDS = [
  ["assets/img/hero-earth.jpg", 960],
  ["assets/img/hero-earth.jpg", 1600],
  ["assets/img/glyph-slab.jpg", 1280],
  ["assets/img/poster-reflection.jpg", 600]
];

const extensionFor = (format) => (format === "jpeg" ? "jpg" : format);

module.exports = async function (cfg) {
  const { default: eleventyImage, generateHTML } = await import("@11ty/eleventy-img");

  const prefix = process.env.PATH_PREFIX || "/";
  const urlPath = (prefix.endsWith("/") ? prefix : prefix + "/") + IMAGE_PATH + "/";

  let outputDir = "_site";
  cfg.on("eleventy.directories", (dirs) => {
    outputDir = dirs.output;
  });

  cfg.on("eleventy.before", async () => {
    for (const [src, width] of CSS_BACKGROUNDS) {
      const stem = path.basename(src, path.extname(src));
      await eleventyImage(src, {
        ...IMAGE_QUALITY,
        widths: [width],
        formats: IMAGE_FORMATS,
        outputDir: path.join(outputDir, "assets", "img"),
        urlPath: "/assets/img/",
        useCache: false,
        filenameFormat: (id, source, w, format) => `${stem}-${width}.${extensionFor(format)}`
      });
    }
  });

  cfg.on("eleventy.after", async () => {
    if (fs.existsSync(IMAGE_CACHE)) {
      await fs.promises.cp(IMAGE_CACHE, path.join(outputDir, IMAGE_PATH), { recursive: true });
    }
  });

  cfg.addAsyncShortcode("picture", async (src, alt, widths, sizes, attrs) => {
    if (!src || !fs.existsSync(src)) {
      return "";
    }
    const metadata = await eleventyImage(src, {
      ...IMAGE_QUALITY,
      widths,
      formats: IMAGE_FORMATS,
      outputDir: IMAGE_CACHE,
      urlPath
    });
    return generateHTML(metadata, Object.assign({ alt, sizes, decoding: "async" }, attrs));
  });

  cfg.addPassthroughCopy({ "assets": "assets" });
  cfg.addPassthroughCopy("CNAME");

  cfg.addFilter("dayNum", (n) => String(n).padStart(4, "0"));
  cfg.addFilter("pad2", (n) => String(n).padStart(2, "0"));
  cfg.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  cfg.addFilter("rssDate", (d) => new Date(d).toUTCString());

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
