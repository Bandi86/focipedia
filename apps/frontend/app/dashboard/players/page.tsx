import DashboardShell from '@/components/dashboard/DashboardShell';

export const dynamic = 'force-dynamic';

export default function PlayersPage() {
  return (
    <DashboardShell title="Játékosok">
      <div className="rounded-xl p-6 bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur min-h-[50vh]">
        Hamarosan: játékos böngésző és szűrők.
      </div>
    </DashboardShell>
  );
}


