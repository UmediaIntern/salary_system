// next-i18next.config.js
import path from 'path'

/** @type {import("next-i18next").UserConfig} */
const config = {
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === "development",
  i18n: {
    locales: ["en", "zh-TW"],
    defaultLocale: "en",
  },
  localePath: path.resolve("./public/locales"),
};

export default config;
