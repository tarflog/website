// Записи журнала: layout, адрес /log/tl-NNNN/ (номер фрагмента = день записи),
// будущие даты не публикуются. Словом «day» говорит только сам Тарф.
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
