// Записи журнала: layout, адрес /log/day-NNNN/, будущие даты не публикуются.
module.exports = {
  layout: "entry.njk",
  tags: ["logpage"],
  eleventyComputed: {
    permalink: (data) =>
      new Date(data.declassified) <= new Date()
        ? `/log/${data.page.fileSlug}/`
        : false,
    eleventyExcludeFromCollections: (data) =>
      new Date(data.declassified) > new Date()
  }
};
