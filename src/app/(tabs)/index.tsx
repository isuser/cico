import { PlaceholderScreen } from '@/components/placeholder-screen';
import { BottomTabInset } from '@/constants/theme';

export default function CicoScreen() {
  return (
    <PlaceholderScreen
      title="CICO"
      subtitle="Daily food log — coming soon: meal categories, calorie summary, and food entries."
      bottomInset={BottomTabInset}
    />
  );
}
