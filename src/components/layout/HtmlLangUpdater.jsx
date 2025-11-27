"use client";
import { useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";

export default function HtmlLangUpdater() {
  const { lang } = useLanguage();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return null;
}

