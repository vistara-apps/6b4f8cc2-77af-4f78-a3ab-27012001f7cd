import { DrawDashboard } from '@/components/DrawDashboard';
import { AppShell } from '@/components/AppShell';

export default function HomePage() {
  return (
    <AppShell>
      <DrawDashboard />
    </AppShell>
  );
}
