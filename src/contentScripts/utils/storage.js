import { STORAGE_TRACKS } from './constants';

export async function storageGetTrack(trackId) {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_TRACKS], (storageData = {}) => {
      const storageTracks = storageData[STORAGE_TRACKS] || {};
      const trackData = storageTracks[trackId] || {};
      resolve(trackData);
    });
  });
}

export async function storageUpdateTrack(trackId, trackData) {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_TRACKS], (storageData = {}) => {
      const storageTracks = storageData[STORAGE_TRACKS] || {};
      storageTracks[trackId] = trackData;
      chrome.storage.local.set({ [STORAGE_TRACKS]: storageTracks }, resolve);
    });
  });
}