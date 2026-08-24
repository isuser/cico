export type ExerciseCategory =
  | 'walking_running'
  | 'cycling'
  | 'sports'
  | 'gym_fitness'
  | 'household'
  | 'occupation'
  | 'water_winter_sports'
  | 'dance_leisure';

/** MET value per activity, curated from the 2024 Compendium of Physical Activities. */
export interface ExerciseActivity {
  /** Stable kebab-case slug. Logged sessions snapshot name/met at log time,
   *  so this only needs to stay stable for in-app referencing (e.g. React
   *  keys), not foreign-key integrity. */
  id: string;
  name: string;
  category: ExerciseCategory;
  met: number;
}

export const EXERCISE_ACTIVITIES: ExerciseActivity[] = [
  // Walking / running
  { id: 'walking-slow-2mph', name: 'Walking, slow (2 mph)', category: 'walking_running', met: 2.8 },
  { id: 'walking-moderate-3mph', name: 'Walking, moderate pace (3 mph)', category: 'walking_running', met: 3.5 },
  { id: 'walking-brisk-3-5mph', name: 'Walking, brisk pace (3.5 mph)', category: 'walking_running', met: 4.3 },
  { id: 'walking-very-brisk-4mph', name: 'Walking, very brisk (4 mph)', category: 'walking_running', met: 5.0 },
  { id: 'walking-uphill', name: 'Walking uphill', category: 'walking_running', met: 6.0 },
  { id: 'hiking-cross-country', name: 'Hiking, cross country', category: 'walking_running', met: 6.0 },
  { id: 'race-walking', name: 'Race walking', category: 'walking_running', met: 6.5 },
  { id: 'jogging-general', name: 'Jogging, general', category: 'walking_running', met: 7.0 },
  { id: 'running-5mph', name: 'Running, 5 mph (12 min/mile)', category: 'walking_running', met: 8.3 },
  { id: 'running-6mph', name: 'Running, 6 mph (10 min/mile)', category: 'walking_running', met: 9.8 },
  { id: 'running-7mph', name: 'Running, 7 mph (8.5 min/mile)', category: 'walking_running', met: 11.0 },
  { id: 'running-8mph', name: 'Running, 8 mph (7.5 min/mile)', category: 'walking_running', met: 11.8 },
  { id: 'running-9mph', name: 'Running, 9 mph (6.5 min/mile)', category: 'walking_running', met: 12.8 },
  { id: 'running-10mph', name: 'Running, 10 mph (6 min/mile)', category: 'walking_running', met: 14.5 },
  { id: 'running-stairs', name: 'Running, stairs', category: 'walking_running', met: 15.0 },
  { id: 'treadmill-walking', name: 'Treadmill, walking', category: 'walking_running', met: 3.5 },
  { id: 'treadmill-running', name: 'Treadmill, running', category: 'walking_running', met: 9.0 },

  // Cycling
  { id: 'cycling-leisure', name: 'Cycling, leisure (<10 mph)', category: 'cycling', met: 4.0 },
  { id: 'cycling-light', name: 'Cycling, light effort (10-11.9 mph)', category: 'cycling', met: 6.8 },
  { id: 'cycling-moderate', name: 'Cycling, moderate effort (12-13.9 mph)', category: 'cycling', met: 8.0 },
  { id: 'cycling-vigorous', name: 'Cycling, vigorous effort (14-15.9 mph)', category: 'cycling', met: 10.0 },
  { id: 'cycling-racing', name: 'Cycling, racing (16-19 mph)', category: 'cycling', met: 12.0 },
  { id: 'cycling-racing-fast', name: 'Cycling, racing (>20 mph)', category: 'cycling', met: 15.8 },
  { id: 'mountain-biking', name: 'Mountain biking', category: 'cycling', met: 8.5 },
  { id: 'stationary-bike-light', name: 'Stationary bike, light effort', category: 'cycling', met: 5.5 },
  { id: 'stationary-bike-moderate', name: 'Stationary bike, moderate effort', category: 'cycling', met: 7.0 },
  { id: 'stationary-bike-vigorous', name: 'Stationary bike, vigorous effort', category: 'cycling', met: 10.5 },
  { id: 'spin-class', name: 'Spin class', category: 'cycling', met: 8.5 },
  { id: 'bmx', name: 'BMX', category: 'cycling', met: 8.5 },

  // Sports
  { id: 'basketball-game', name: 'Basketball, game', category: 'sports', met: 8.0 },
  { id: 'basketball-shooting-around', name: 'Basketball, shooting around', category: 'sports', met: 4.5 },
  { id: 'soccer-casual', name: 'Soccer, casual', category: 'sports', met: 7.0 },
  { id: 'soccer-competitive', name: 'Soccer, competitive', category: 'sports', met: 10.0 },
  { id: 'tennis-singles', name: 'Tennis, singles', category: 'sports', met: 8.0 },
  { id: 'tennis-doubles', name: 'Tennis, doubles', category: 'sports', met: 6.0 },
  { id: 'volleyball-competitive', name: 'Volleyball, competitive', category: 'sports', met: 4.0 },
  { id: 'volleyball-beach', name: 'Volleyball, beach', category: 'sports', met: 8.0 },
  { id: 'badminton', name: 'Badminton', category: 'sports', met: 5.5 },
  { id: 'table-tennis', name: 'Table tennis', category: 'sports', met: 4.0 },
  { id: 'golf-walking-carrying-clubs', name: 'Golf, walking, carrying clubs', category: 'sports', met: 4.3 },
  { id: 'golf-using-cart', name: 'Golf, using cart', category: 'sports', met: 3.5 },
  { id: 'baseball-softball', name: 'Baseball / softball', category: 'sports', met: 5.0 },
  { id: 'football-competitive', name: 'American football, competitive', category: 'sports', met: 8.0 },
  { id: 'football-touch', name: 'American football, touch/flag', category: 'sports', met: 8.0 },
  { id: 'rugby', name: 'Rugby', category: 'sports', met: 10.0 },
  { id: 'hockey-ice', name: 'Hockey, ice', category: 'sports', met: 8.0 },
  { id: 'hockey-field', name: 'Hockey, field', category: 'sports', met: 8.0 },
  { id: 'handball', name: 'Handball', category: 'sports', met: 12.0 },
  { id: 'squash', name: 'Squash', category: 'sports', met: 12.0 },
  { id: 'racquetball', name: 'Racquetball', category: 'sports', met: 7.0 },
  { id: 'cricket', name: 'Cricket', category: 'sports', met: 5.0 },
  { id: 'boxing-sparring', name: 'Boxing, sparring', category: 'sports', met: 7.8 },
  { id: 'boxing-punching-bag', name: 'Boxing, punching bag', category: 'sports', met: 5.5 },
  { id: 'martial-arts', name: 'Martial arts, moderate pace', category: 'sports', met: 10.3 },
  { id: 'wrestling', name: 'Wrestling', category: 'sports', met: 6.0 },
  { id: 'rock-climbing', name: 'Rock climbing', category: 'sports', met: 8.0 },
  { id: 'bouldering', name: 'Bouldering', category: 'sports', met: 5.8 },
  { id: 'gymnastics', name: 'Gymnastics', category: 'sports', met: 4.0 },
  { id: 'cheerleading', name: 'Cheerleading', category: 'sports', met: 5.0 },
  { id: 'frisbee', name: 'Frisbee', category: 'sports', met: 3.0 },
  { id: 'ultimate-frisbee', name: 'Ultimate frisbee', category: 'sports', met: 8.0 },
  { id: 'skateboarding', name: 'Skateboarding', category: 'sports', met: 5.0 },
  { id: 'rollerblading', name: 'Rollerblading / inline skating', category: 'sports', met: 7.5 },
  { id: 'ice-skating', name: 'Ice skating, general', category: 'sports', met: 7.0 },
  { id: 'trampoline', name: 'Trampoline', category: 'sports', met: 3.5 },
  { id: 'archery', name: 'Archery', category: 'sports', met: 3.5 },
  { id: 'bowling', name: 'Bowling', category: 'sports', met: 3.0 },
  { id: 'fencing', name: 'Fencing', category: 'sports', met: 6.0 },
  { id: 'horseback-riding', name: 'Horseback riding', category: 'sports', met: 5.5 },

  // Gym / fitness
  { id: 'weight-training-light', name: 'Weight training, light effort', category: 'gym_fitness', met: 3.5 },
  { id: 'weight-training-vigorous', name: 'Weight training, vigorous effort', category: 'gym_fitness', met: 6.0 },
  { id: 'circuit-training', name: 'Circuit training', category: 'gym_fitness', met: 8.0 },
  { id: 'crossfit-hiit', name: 'CrossFit / high-intensity interval training', category: 'gym_fitness', met: 8.0 },
  { id: 'calisthenics-moderate', name: 'Calisthenics, moderate effort', category: 'gym_fitness', met: 3.8 },
  { id: 'calisthenics-vigorous', name: 'Calisthenics, vigorous (push-ups, pull-ups)', category: 'gym_fitness', met: 8.0 },
  { id: 'yoga-hatha', name: 'Yoga, Hatha', category: 'gym_fitness', met: 2.5 },
  { id: 'yoga-power', name: 'Yoga, power', category: 'gym_fitness', met: 4.0 },
  { id: 'pilates', name: 'Pilates', category: 'gym_fitness', met: 3.0 },
  { id: 'stretching', name: 'Stretching', category: 'gym_fitness', met: 2.3 },
  { id: 'elliptical-trainer', name: 'Elliptical trainer', category: 'gym_fitness', met: 5.0 },
  { id: 'rowing-machine-moderate', name: 'Rowing machine, moderate effort', category: 'gym_fitness', met: 7.0 },
  { id: 'rowing-machine-vigorous', name: 'Rowing machine, vigorous effort', category: 'gym_fitness', met: 8.5 },
  { id: 'stair-climbing-machine', name: 'Stair climbing machine', category: 'gym_fitness', met: 9.0 },
  { id: 'aerobics-low-impact', name: 'Aerobics, low impact', category: 'gym_fitness', met: 5.0 },
  { id: 'aerobics-high-impact', name: 'Aerobics, high impact', category: 'gym_fitness', met: 7.3 },
  { id: 'aerobics-step', name: 'Aerobics, step', category: 'gym_fitness', met: 8.5 },
  { id: 'zumba', name: 'Zumba', category: 'gym_fitness', met: 6.5 },
  { id: 'kickboxing', name: 'Kickboxing', category: 'gym_fitness', met: 8.0 },
  { id: 'barre', name: 'Barre', category: 'gym_fitness', met: 3.5 },
  { id: 'functional-training', name: 'Functional training', category: 'gym_fitness', met: 6.0 },
  { id: 'jump-rope-moderate', name: 'Jump rope, moderate pace', category: 'gym_fitness', met: 8.8 },
  { id: 'jump-rope-fast', name: 'Jump rope, fast pace', category: 'gym_fitness', met: 12.3 },
  { id: 'trx-suspension-training', name: 'TRX / suspension training', category: 'gym_fitness', met: 6.0 },
  { id: 'bodyweight-hiit', name: 'Bodyweight HIIT', category: 'gym_fitness', met: 8.0 },

  // Household
  { id: 'cleaning-general', name: 'Cleaning, general', category: 'household', met: 3.3 },
  { id: 'cleaning-heavy', name: 'Cleaning, heavy (washing car, windows)', category: 'household', met: 3.0 },
  { id: 'vacuuming', name: 'Vacuuming', category: 'household', met: 3.3 },
  { id: 'sweeping', name: 'Sweeping', category: 'household', met: 3.3 },
  { id: 'mopping', name: 'Mopping', category: 'household', met: 3.5 },
  { id: 'dusting', name: 'Dusting', category: 'household', met: 2.3 },
  { id: 'laundry-folding', name: 'Laundry, folding', category: 'household', met: 2.0 },
  { id: 'cooking', name: 'Cooking', category: 'household', met: 2.5 },
  { id: 'washing-dishes', name: 'Washing dishes', category: 'household', met: 2.3 },
  { id: 'gardening-general', name: 'Gardening, general', category: 'household', met: 3.8 },
  { id: 'mowing-lawn-push', name: 'Mowing lawn, push mower', category: 'household', met: 5.5 },
  { id: 'mowing-lawn-riding', name: 'Mowing lawn, riding mower', category: 'household', met: 2.5 },
  { id: 'raking-leaves', name: 'Raking leaves', category: 'household', met: 4.0 },
  { id: 'shoveling-snow', name: 'Shoveling snow', category: 'household', met: 6.0 },
  { id: 'painting-house', name: 'Painting house', category: 'household', met: 4.5 },
  { id: 'moving-furniture', name: 'Moving furniture', category: 'household', met: 6.0 },
  { id: 'carrying-groceries', name: 'Carrying groceries', category: 'household', met: 3.0 },
  { id: 'childcare-active', name: 'Childcare, active (bathing, feeding, dressing)', category: 'household', met: 4.0 },
  { id: 'washing-car', name: 'Washing car', category: 'household', met: 3.0 },
  { id: 'home-repair', name: 'Home repair, general', category: 'household', met: 4.5 },

  // Occupation
  { id: 'sitting-office-work', name: 'Sitting, office work', category: 'occupation', met: 1.5 },
  { id: 'standing-light-work', name: 'Standing, light work', category: 'occupation', met: 2.3 },
  { id: 'construction-general-labor', name: 'Construction, general labor', category: 'occupation', met: 5.5 },
  { id: 'carpentry', name: 'Carpentry', category: 'occupation', met: 3.5 },
  { id: 'farming-general', name: 'Farming, general', category: 'occupation', met: 4.5 },
  { id: 'landscaping', name: 'Landscaping', category: 'occupation', met: 5.0 },
  { id: 'warehouse-work', name: 'Warehouse work, moving boxes', category: 'occupation', met: 4.0 },
  { id: 'nursing-active-patient-care', name: 'Nursing, active patient care', category: 'occupation', met: 3.5 },
  { id: 'teaching-standing', name: 'Teaching, standing', category: 'occupation', met: 2.5 },
  { id: 'retail-standing-walking', name: 'Retail, standing/walking', category: 'occupation', met: 2.3 },
  { id: 'custodial-work', name: 'Custodial work', category: 'occupation', met: 3.5 },
  { id: 'firefighting', name: 'Firefighting', category: 'occupation', met: 12.0 },
  { id: 'mail-carrier', name: 'Mail carrier, walking', category: 'occupation', met: 4.0 },
  { id: 'waiting-tables', name: 'Waiting tables', category: 'occupation', met: 2.5 },
  { id: 'truck-driving', name: 'Truck driving', category: 'occupation', met: 1.5 },

  // Water / winter sports
  { id: 'swimming-leisurely', name: 'Swimming, leisurely', category: 'water_winter_sports', met: 6.0 },
  { id: 'swimming-moderate-laps', name: 'Swimming, moderate laps', category: 'water_winter_sports', met: 8.3 },
  { id: 'swimming-vigorous-laps', name: 'Swimming, vigorous laps', category: 'water_winter_sports', met: 9.8 },
  { id: 'water-aerobics', name: 'Water aerobics', category: 'water_winter_sports', met: 4.0 },
  { id: 'water-polo', name: 'Water polo', category: 'water_winter_sports', met: 10.0 },
  { id: 'surfing', name: 'Surfing', category: 'water_winter_sports', met: 3.0 },
  { id: 'kayaking', name: 'Kayaking', category: 'water_winter_sports', met: 5.0 },
  { id: 'canoeing-leisure', name: 'Canoeing, leisure', category: 'water_winter_sports', met: 3.0 },
  { id: 'canoeing-vigorous', name: 'Canoeing, vigorous', category: 'water_winter_sports', met: 7.0 },
  { id: 'rowing-crew', name: 'Rowing, crew/competitive', category: 'water_winter_sports', met: 8.5 },
  { id: 'stand-up-paddleboarding', name: 'Stand-up paddleboarding', category: 'water_winter_sports', met: 6.0 },
  { id: 'snorkeling', name: 'Snorkeling', category: 'water_winter_sports', met: 5.0 },
  { id: 'skiing-downhill-moderate', name: 'Skiing, downhill, moderate effort', category: 'water_winter_sports', met: 6.0 },
  { id: 'skiing-cross-country-moderate', name: 'Skiing, cross country, moderate effort', category: 'water_winter_sports', met: 8.0 },
  { id: 'snowboarding', name: 'Snowboarding', category: 'water_winter_sports', met: 5.3 },
  { id: 'sledding', name: 'Sledding', category: 'water_winter_sports', met: 7.0 },
  { id: 'ice-skating-recreational', name: 'Ice skating, recreational', category: 'water_winter_sports', met: 7.0 },

  // Dance / leisure
  { id: 'dancing-general', name: 'Dancing, general', category: 'dance_leisure', met: 4.5 },
  { id: 'dancing-ballroom', name: 'Dancing, ballroom', category: 'dance_leisure', met: 3.0 },
  { id: 'dancing-aerobic-fast', name: 'Dancing, aerobic/fast', category: 'dance_leisure', met: 6.5 },
  { id: 'dancing-salsa', name: 'Dancing, salsa', category: 'dance_leisure', met: 5.0 },
  { id: 'ballet', name: 'Ballet', category: 'dance_leisure', met: 5.0 },
  { id: 'walking-the-dog', name: 'Walking the dog', category: 'dance_leisure', met: 3.0 },
  { id: 'playing-with-kids-moderate', name: 'Playing with kids, moderate effort', category: 'dance_leisure', met: 4.0 },
  { id: 'playing-with-kids-vigorous', name: 'Playing with kids, vigorous effort', category: 'dance_leisure', met: 5.8 },
  { id: 'fishing-sitting', name: 'Fishing, sitting', category: 'dance_leisure', met: 2.0 },
  { id: 'fishing-standing-casting', name: 'Fishing, standing/casting', category: 'dance_leisure', met: 3.5 },
  { id: 'hunting', name: 'Hunting', category: 'dance_leisure', met: 5.0 },
  { id: 'billiards', name: 'Billiards', category: 'dance_leisure', met: 2.5 },
  { id: 'darts', name: 'Darts', category: 'dance_leisure', met: 2.5 },
];

/** Case-insensitive substring match on name, capped like `searchFoodsLocal`'s
 *  LIMIT 50. Empty/whitespace query returns no results. */
export function searchExerciseActivities(query: string): ExerciseActivity[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return EXERCISE_ACTIVITIES.filter((activity) => activity.name.toLowerCase().includes(q)).slice(0, 50);
}
