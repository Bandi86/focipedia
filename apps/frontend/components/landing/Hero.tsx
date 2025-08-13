"use client";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { Button } from "@/components/ui/button";

interface Props {
  onLogin?: () => void;
  onRegister?: () => void;
}

export default function Hero({ onLogin, onRegister }: Props) {
  const { t } = useTranslation();
  return (
    <section className={cn("relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-900")}>
      <div className="absolute inset-0 opacity-10" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
          }}
        />
      </div>
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          {t("common:hero.title")}
          <span className="block bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">{t("common:hero.highlight")}</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-100">{t("common:hero.subtitle")}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            onClick={onRegister || (() => (window.location.href = "/register"))}
          >
            {t("common:buttons.register")}
          </Button>
          <Button
            className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-transparent hover:bg-transparent text-white border border-white/40"
            onClick={onLogin || (() => (window.location.href = "/login"))}
          >
            {t("common:buttons.login")}
          </Button>
        </div>
      </div>
    </section>
  );
}


