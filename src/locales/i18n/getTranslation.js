import en from "../../locales/en.json";
import bg from "../../locales/bg.json";

const languages = {
  en,
  bg,
};

export function t(lang = "en", key) {
  return languages?.[lang]?.[key] || key;
}
