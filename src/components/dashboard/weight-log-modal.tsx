import { useEffect, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/form-field';
import { DayHeader } from '@/components/cico/day-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getWeightLogForDate, useDatabase, type Units } from '@/db';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/i18n/context';
import { addDays, parseISODate, toISODate } from '@/lib/date';
import { kgToLbsRounded, lbsToKg } from '@/lib/units';

export function WeightLogModal({
  visible,
  units,
  date,
  todayIso,
  onChangeDate,
  onClose,
  onSave,
}: {
  visible: boolean;
  units: Units;
  /** The date being logged — any date up to today can be chosen. */
  date: string;
  todayIso: string;
  onChangeDate: (date: string) => void;
  onClose: () => void;
  onSave: (date: string, weightKg: number) => Promise<void>;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const db = useDatabase();
  const [weight, setWeight] = useState('');
  /** Whether `date` already has an entry — saving overwrites it (one weight per day). */
  const [hasExistingEntry, setHasExistingEntry] = useState(false);
  const [saving, setSaving] = useState(false);
  const isValid = Number(weight) > 0;
  const isImperial = units === 'imperial';

  // Prefills the existing entry for the selected date so re-logging a day reads as an edit.
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    getWeightLogForDate(db, date).then((existing) => {
      if (cancelled) return;
      setHasExistingEntry(existing !== null);
      setWeight(
        existing ? String(isImperial ? kgToLbsRounded(existing.weight) : existing.weight) : ''
      );
    });
    return () => {
      cancelled = true;
    };
  }, [db, visible, date, isImperial]);

  const shiftDate = (days: number) => onChangeDate(toISODate(addDays(parseISODate(date), days)));

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      await onSave(date, isImperial ? lbsToKg(Number(weight)) : Number(weight));
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
            <DayHeader
              date={date}
              todayIso={todayIso}
              onPrev={() => shiftDate(-1)}
              onNext={() => shiftDate(1)}
            />
            <FormField
              label={t('dashboard.weightModal.weightLabel')}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder={isImperial ? '154' : '70'}
              suffix={isImperial ? 'lbs' : 'kg'}
              autoFocus
            />
            {hasExistingEntry ? (
              <ThemedText type="label" themeColor="textSecondary">
                {t('dashboard.weightModal.replacesExisting')}
              </ThemedText>
            ) : null}
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
