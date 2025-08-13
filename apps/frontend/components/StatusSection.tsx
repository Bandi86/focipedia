"use client";
import { useTranslation } from "react-i18next";

export default function StatusSection({ health }: { health: unknown }) {
  const { t } = useTranslation();
  return (
    <section className="max-w-4xl mx-auto px-6 mt-8">
      <h2 className="text-xl font-semibold mb-2">{t("common:status")}</h2>
      <pre className="text-xs bg-gray-100 p-2 rounded w-full overflow-x-auto">{JSON.stringify(health, null, 2)}</pre>
    </section>
  );
}


