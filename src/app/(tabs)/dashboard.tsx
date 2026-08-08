import { PlaceholderScreen } from '@/components/placeholder-screen';
import { BottomTabInset } from '@/constants/theme';

export default function DashboardScreen() {
  return (
    <PlaceholderScreen
      title="Dashboard"
      subtitle="Weekly overview — coming soon: calorie chart, history browsing, and weight log."
      bottomInset={BottomTabInset}
    />
  );
}
