import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import type { PropsWithChildren } from 'react';

import { migrateDbIfNeeded } from './schema';

const DATABASE_NAME = 'cico.db';

export function DatabaseProvider({ children }: PropsWithChildren) {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded}>
      {children}
    </SQLiteProvider>
  );
}

export const useDatabase = useSQLiteContext;
