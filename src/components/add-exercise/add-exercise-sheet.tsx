import { useEffect, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { DurationScreen } from '@/components/add-exercise/duration-screen';
import { SearchScreen } from '@/components/add-exercise/search-screen';
import { insertExerciseLog, useDatabase } from '@/db';
import type { ExerciseActivity } from '@/lib/exerciseActivities';

type SheetView = 'search' | 'duration';

export function AddExerciseSheet({
  visible,
  date,
  weightKg,
  onClose,
  onLogged,
}: {
  visible: boolean;
  date: string;
  weightKg: number | null;
  onClose: () => void;
  onLogged: () => void;
}) {
  const db = useDatabase();
  const [view, setView] = useState<SheetView>('search');
  const [selectedActivity, setSelectedActivity] = useState<ExerciseActivity | null>(null);

  useEffect(() => {
    if (visible) {
      setView('search');
      setSelectedActivity(null);
    }
  }, [visible]);

  if (!visible || weightKg === null) {
    return null;
  }

  const handleLogDuration = async (durationMinutes: number, caloriesBurned: number) => {
    if (!selectedActivity) return;
    await insertExerciseLog(db, {
      date,
      activity_name: selectedActivity.name,
      met_value: selectedActivity.met,
      duration_minutes: durationMinutes,
      calories_burned: caloriesBurned,
    });
    onLogged();
    onClose();
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        {view === 'search' ? (
          <SearchScreen
            onClose={onClose}
            onSelect={(activity) => {
              setSelectedActivity(activity);
              setView('duration');
            }}
          />
        ) : null}
        {view === 'duration' && selectedActivity ? (
          <DurationScreen
            activity={selectedActivity}
            weightKg={weightKg}
            onClose={onClose}
            onLog={handleLogDuration}
          />
        ) : null}
      </View>
    </Modal>
  );
}
