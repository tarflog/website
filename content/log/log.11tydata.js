// Записи журнала: layout, адрес /log/tl-NNNN/ (номер фрагмента = день записи),
// будущие даты не публикуются. Словом «day» говорит только сам Тарф.
// Описание страницы — начало самого фрагмента: без него все записи приходят
// в поиск с одним и тем же слоганом сайта и выглядят как копии друг друга.
const summarize = (raw, limit = 155) => {
  const text = String(raw || "").replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—-]$/, "") + "…";
};

module.exports = {
  layout: "entry.njk",
  tags: ["logpage"],
  eleventyComputed: {
    description: (data) => data.description || summarize(data.page.rawInput),
    permalink: (data) =>
      new Date(data.declassified) <= new Date()
        ? `/log/${data.page.fileSlug}/`
        : false,
    eleventyExcludeFromCollections: (data) =>
      new Date(data.declassified) > new Date()
  }
};
