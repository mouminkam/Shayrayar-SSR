import en from "../../locales/en.json";
import bg from "../../locales/bg.json";

const languages = {
  en,
  bg,
};

export function t(lang = "bg", key) {
  return languages?.[lang]?.[key] || key;
}
