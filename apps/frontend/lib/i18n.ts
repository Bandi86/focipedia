"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import huCommon from "../locales/hu/common.json";
import enCommon from "../locales/en/common.json";
const resources = {
  hu: { common: huCommon },
  en: { common: enCommon },
} as const;

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "hu",
    fallbackLng: "en",
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
  });
}

export default i18n;


