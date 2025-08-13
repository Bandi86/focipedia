import DashboardShell from '@/components/dashboard/DashboardShell';
import { WidgetGrid } from '@/components/dashboard/WidgetGrid';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <DashboardShell>
      <WidgetGrid />
    </DashboardShell>
  );
}


