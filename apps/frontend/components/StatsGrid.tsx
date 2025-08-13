"use client";
import { useTranslation } from "react-i18next";

export default function StatsGrid() {
  const { t } = useTranslation();
  const items = [
    { key: "players", value: "—" },
    { key: "teams", value: "—" },
    { key: "matches", value: "—" },
    { key: "trophies", value: "—" },
  ] as const;

  return (
    <section className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.key} className="rounded-lg border border-white/10 bg-white/5 backdrop-blur p-4 text-center shadow-sm">
            <div className="text-2xl md:text-3xl font-bold text-white">{item.value}</div>
            <div className="text-xs md:text-sm text-gray-200 mt-1">{t(`common:statsSection.${item.key}`)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


