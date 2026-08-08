import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function WeightLogModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (weightKg: number) => Promise<void>;
}) {
  const theme = useTheme();
  const [weight, setWeight] = useState('');
  const [saving, setSaving] = useState(false);
  const isValid = Number(weight) > 0;

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      await onSave(Number(weight));
      setWeight('');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <ThemedView
          style={{
            borderTopLeftRadius: Spacing.five,
            borderTopRightRadius: Spacing.five,
            padding: Spacing.four,
          }}>
          <SafeAreaView edges={['bottom']} style={{ gap: Spacing.three }}>
            <ThemedText type="subtitle">Log your weight</ThemedText>
            <FormField
              label="Weight"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder="70"
              suffix="kg"
              autoFocus
            />
            <Pressable
              onPress={handleSave}
              disabled={!isValid || saving}
              style={({ pressed }) => [
                {
                  backgroundColor: isValid ? theme.accent : '#9CA3AF',
                  paddingVertical: Spacing.three,
                  borderRadius: Spacing.three,
                  alignItems: 'center',
                  marginTop: Spacing.two,
                },
                pressed && isValid && { opacity: 0.85 },
              ]}>
              <ThemedText type="default" style={{ color: '#ffffff' }}>
                {saving ? 'Saving…' : 'Save'}
              </ThemedText>
            </Pressable>
            <Pressable onPress={onClose} style={{ alignItems: 'center', paddingVertical: Spacing.two }}>
              <ThemedText type="default" themeColor="textSecondary">
                Cancel
              </ThemedText>
            </Pressable>
          </SafeAreaView>
        </ThemedView>
      </View>
    </Modal>
  );
}
