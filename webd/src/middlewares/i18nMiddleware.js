const locales = {
  en: require("../locales/en.json"),
  fr: require("../locales/fr.json"),
};

const defaultLocale = "fr";

const i18nMiddleware = (req, res, next) => {
  const langHeader = req.headers["accept-language"];
  const lang = langHeader
    ? langHeader.split(",")[0].toLowerCase()
    : defaultLocale;
  req.locale = locales[lang] ? lang : defaultLocale;
  req.t = (key) => locales[req.locale][key] || key;
  next();
};

module.exports = i18nMiddleware;
