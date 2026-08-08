import { PlaceholderScreen } from '@/components/placeholder-screen';
import { BottomTabInset } from '@/constants/theme';

export default function ProfileScreen() {
  return (
    <PlaceholderScreen
      title="Profile"
      subtitle="Settings — coming soon: personal info, goal settings, units, and preferences."
      bottomInset={BottomTabInset}
    />
  );
}
