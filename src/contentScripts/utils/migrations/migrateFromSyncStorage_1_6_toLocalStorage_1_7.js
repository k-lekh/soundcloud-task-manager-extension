import { STORAGE_TRACKS } from '../constants';
import { log, error } from '../log';

export async function migrateFromSyncStorage_1_6_toLocalStorage_1_7() {
  try {
    const data = await new Promise((resolve) => chrome.storage.sync.get([STORAGE_TRACKS], (storageData = {}) => {
      resolve(storageData);
    }));
    await chrome.storage.local.set(data);
    await new Promise((resolve) => chrome.storage.sync.set({[STORAGE_TRACKS]:{}}, resolve));
    log('>> migrateFromSyncStorage_1_6_toLocalStorage_1_7', 'done', data);
  } catch(e) {
    error('>> migrateFromSyncStorage_1_6_toLocalStorage_1_7', e);
  }
}