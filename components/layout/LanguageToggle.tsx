"use client";

import { Languages } from "lucide-react";
import { useEffect, useState } from "react";

const SOURCE_LANGUAGE = "en";
const TARGET_LANGUAGE = "sv";
const TRANSLATE_ELEMENT_ID = "google_translate_element";
const GOOGLE_TRANSLATE_SCRIPT_ID = "google-translate-script";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
          },
          element: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

function setTranslateCookie(language: string) {
  const value = `/auto/${language}`;
  const expires = "path=/; max-age=31536000; SameSite=Lax";

  document.cookie = `googtrans=${value}; ${expires}`;
  document.cookie = `googtrans=${value}; domain=.${window.location.hostname}; ${expires}`;
}

function applyLanguage(language: string) {
  setTranslateCookie(language);
  hideGoogleTranslateBanner();

  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (!select) {
    return false;
  }

  select.value = language;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  window.setTimeout(hideGoogleTranslateBanner, 250);
  window.setTimeout(hideGoogleTranslateBanner, 1000);
  return true;
}

function hideGoogleTranslateBanner() {
  document.documentElement.style.top = "0px";
  document.body.style.top = "0px";
  document.body.style.position = "";

  document
    .querySelectorAll<HTMLElement>(
      ".goog-te-banner-frame, .goog-te-balloon-frame, .goog-te-menu-frame, .skiptranslate"
    )
    .forEach((element) => {
      if (element.id !== TRANSLATE_ELEMENT_ID) {
        element.style.display = "none";
      }
    });
}

export default function LanguageToggle() {
  const [language, setLanguage] = useState(SOURCE_LANGUAGE);

  useEffect(() => {
    hideGoogleTranslateBanner();

    const observer = new MutationObserver(hideGoogleTranslateBanner);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
      childList: true,
      subtree: true,
    });

    if (!document.getElementById(TRANSLATE_ELEMENT_ID)) {
      const translateElement = document.createElement("div");
      translateElement.id = TRANSLATE_ELEMENT_ID;
      translateElement.setAttribute("aria-hidden", "true");
      document.body.appendChild(translateElement);
    }

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) {
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: SOURCE_LANGUAGE,
          includedLanguages: `${SOURCE_LANGUAGE},${TARGET_LANGUAGE}`,
          autoDisplay: false,
        },
        TRANSLATE_ELEMENT_ID
      );
    };

    if (!document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.googleTranslateElementInit();
    }

    const savedLanguage = localStorage.getItem("site-language");
    if (savedLanguage === TARGET_LANGUAGE) {
      window.setTimeout(() => {
        setLanguage(TARGET_LANGUAGE);
        applyLanguage(TARGET_LANGUAGE);
      }, 800);
    }

    return () => observer.disconnect();
  }, []);

  function handleToggle() {
    const nextLanguage =
      language === TARGET_LANGUAGE ? SOURCE_LANGUAGE : TARGET_LANGUAGE;

    setLanguage(nextLanguage);
    localStorage.setItem("site-language", nextLanguage);

    if (!applyLanguage(nextLanguage)) {
      window.setTimeout(() => applyLanguage(nextLanguage), 800);
    }
  }

  return (
    <button
      type="button"
      className="inline-flex h-11 items-center gap-2 rounded-full border border-[#d9e3d8] px-4 text-[14px] font-bold leading-none text-[#31583d] transition-colors hover:border-[#31583d] hover:bg-[#f4f8f0]"
      aria-label={
        language === TARGET_LANGUAGE
          ? "Switch site language to English"
          : "Switch site language to Swedish"
      }
      onClick={handleToggle}
    >
      <Languages size={18} strokeWidth={2.2} />
      <span>{language === TARGET_LANGUAGE ? "SV" : "EN"}</span>
    </button>
  );
}
