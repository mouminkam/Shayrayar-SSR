"use client";
import { useState } from "react";
import { Languages, ChevronDown } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const LanguageSwitcher = ({ isMobile = false }) => {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (!lang || !setLang) {
    return null;
  }

  const languages = [
    { code: "en", name: "English" },
    { code: "bg", name: "Bulgarian" },
  ];

  const currentLanguage = languages.find((l) => l.code === lang) || languages[0];
  const displayName = currentLanguage.name;

  const handleLanguageChange = (languageCode) => {
    setLang(languageCode);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-all duration-300 cursor-pointer w-full sm:w-auto"
        >
          <Languages className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="flex-1 text-left truncate">{displayName}</span>
          <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-10000" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-2 w-full sm:w-64 bg-bgimg border border-white/20 rounded-xl shadow-2xl z-10001 max-h-64 overflow-y-auto">
              <ul className="py-2">
                {languages.map((language) => {
                  const isSelected = lang === language.code;
                  return (
                    <li key={language.code}>
                      <button
                        onClick={() => handleLanguageChange(language.code)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                          isSelected
                            ? 'bg-theme3/20 text-theme3 font-medium'
                            : 'text-text hover:bg-white/10'
                        }`}
                      >
                        {language.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-all duration-300 cursor-pointer"
      >
        <Languages className="w-4 h-4" />
        <span>{displayName}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-64 bg-bgimg border border-white/20 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
            <ul className="py-2">
              {languages.map((language) => {
                const isSelected = lang === language.code;
                return (
                  <li key={language.code}>
                    <button
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                        isSelected
                          ? 'bg-theme3/20 text-theme3 font-medium'
                          : 'text-text hover:bg-white/10'
                      }`}
                    >
                      {language.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
