import type { SQLiteDatabase } from 'expo-sqlite';

import type { Profile } from './types';

export type ProfileInput = Omit<Profile, 'id' | 'created_at'>;

export async function getProfile(db: SQLiteDatabase): Promise<Profile | null> {
  return db.getFirstAsync<Profile>('SELECT * FROM profile WHERE id = 1');
}

export async function hasProfile(db: SQLiteDatabase): Promise<boolean> {
  return (await getProfile(db)) !== null;
}

/** Creates the single profile row, or overwrites it if one already exists. */
export async function saveProfile(db: SQLiteDatabase, profile: ProfileInput): Promise<Profile> {
  await db.runAsync(
    `INSERT INTO profile (id, name, gender, age, height, weight, calorie_goal, activity_level, units, first_day_of_week, created_at)
     VALUES (1, $name, $gender, $age, $height, $weight, $calorie_goal, $activity_level, $units, $first_day_of_week, $created_at)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       gender = excluded.gender,
       age = excluded.age,
       height = excluded.height,
       weight = excluded.weight,
       calorie_goal = excluded.calorie_goal,
       activity_level = excluded.activity_level,
       units = excluded.units,
       first_day_of_week = excluded.first_day_of_week`,
    {
      $name: profile.name,
      $gender: profile.gender,
      $age: profile.age,
      $height: profile.height,
      $weight: profile.weight,
      $calorie_goal: profile.calorie_goal,
      $activity_level: profile.activity_level,
      $units: profile.units,
      $first_day_of_week: profile.first_day_of_week,
      $created_at: new Date().toISOString(),
    }
  );

  const saved = await getProfile(db);
  if (!saved) {
    throw new Error('Failed to save profile');
  }
  return saved;
}
