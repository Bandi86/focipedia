import DashboardShell from '@/components/dashboard/DashboardShell';
import Link from 'next/link';
import { PlayersStudio } from '@/components/studio/PlayersStudio';
import { TeamsStudio } from '@/components/studio/TeamsStudio';
import { LeaguesStudio } from '@/components/studio/LeaguesStudio';
import { MatchesStudio } from '@/components/studio/MatchesStudio';
import { RequireAdmin } from '@/components/studio/RequireAdmin';

export const dynamic = 'force-dynamic';

export default function StudioPage() {
  return (
    <DashboardShell title="Adatstúdió">
      <RequireAdmin>
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <aside className="rounded-2xl p-4 bg-[#0b0019]/30 text-white border border-white/10 shadow">
          <nav className="space-y-1 text-sm">
            <Link className="block px-3 py-2 rounded hover:bg-white/10" href="#players">Játékosok</Link>
            <Link className="block px-3 py-2 rounded hover:bg-white/10" href="#teams">Csapatok</Link>
            <Link className="block px-3 py-2 rounded hover:bg-white/10" href="#matches">Meccsek</Link>
            <Link className="block px-3 py-2 rounded hover:bg-white/10" href="#leagues">Ligák</Link>
          </nav>
        </aside>
        <section className="space-y-6 min-h-[60vh]">
          <div id="players">
            <PlayersStudio />
          </div>
          <div id="teams">
            <TeamsStudio />
          </div>
          <div id="matches">
            <MatchesStudio />
          </div>
          <div id="leagues">
            <LeaguesStudio />
          </div>
        </section>
        </div>
      </RequireAdmin>
    </DashboardShell>
  );
}


