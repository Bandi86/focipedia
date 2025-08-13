import DashboardShell from '@/components/dashboard/DashboardShell';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <DashboardShell title="Beállítások">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-6 bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur">
          Fiókbeállítások (hamarosan)
        </div>
        <div className="rounded-xl p-6 bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur">
          Értesítések (hamarosan)
        </div>
      </div>
    </DashboardShell>
  );
}


