import DashboardShell from '@/components/dashboard/DashboardShell';
import { WidgetGrid } from '@/components/dashboard/WidgetGrid';

export const dynamic = 'force-dynamic';

export default function MatchesPage() {
  return (
    <DashboardShell title="Meccsek">
      <WidgetGrid />
    </DashboardShell>
  );
}


