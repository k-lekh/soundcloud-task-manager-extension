import { migrateFromSyncStorage_1_6_toLocalStorage_1_7 } from './migrateFromSyncStorage_1_6_ToLocalStorage_1_7';

export async function migrations() {
  await migrateFromSyncStorage_1_6_toLocalStorage_1_7();
}