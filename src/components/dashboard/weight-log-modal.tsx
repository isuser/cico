import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import type { Units } from '@/db';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n/context';
import { lbsToKg } from '@/lib/units';

export function WeightLogModal({
  visible,
  units,
  onClose,
  onSave,
}: {
  visible: boolean;
  units: Units;
  onClose: () => void;
  onSave: (weightKg: number) => Promise<void>;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [weight, setWeight] = useState('');
  const [saving, setSaving] = useState(false);
  const isValid = Number(weight) > 0;
  const isImperial = units === 'imperial';

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      await onSave(isImperial ? lbsToKg(Number(weight)) : Number(weight));
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
            <ThemedText type="subtitle">{t('dashboard.weightModal.title')}</ThemedText>
            <FormField
              label={t('dashboard.weightModal.weightLabel')}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder={isImperial ? '154' : '70'}
              suffix={isImperial ? 'lbs' : 'kg'}
              autoFocus
            />
            <Pressable
              onPress={handleSave}
              disabled={!isValid || saving}
              style={{
                backgroundColor: isValid ? theme.accent : '#9CA3AF',
                paddingVertical: Spacing.three,
                borderRadius: Spacing.three,
                alignItems: 'center',
                marginTop: Spacing.two,
              }}>
              <ThemedText type="default" style={{ color: '#ffffff' }}>
                {saving ? t('common.saving') : t('common.save')}
              </ThemedText>
            </Pressable>
            <Pressable onPress={onClose} style={{ alignItems: 'center', paddingVertical: Spacing.two }}>
              <ThemedText type="default" themeColor="textSecondary">
                {t('common.cancel')}
              </ThemedText>
            </Pressable>
          </SafeAreaView>
        </ThemedView>
      </View>
    </Modal>
  );
}
