const STORAGE_TRACKS = "tracks";

export async function storageGetTrack(trackId) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([STORAGE_TRACKS], (storageData = {}) => {
      const storageTracks = storageData[STORAGE_TRACKS] || {};
      const trackData = storageTracks[trackId] || {};
      resolve(trackData);
    });
  });
}

export async function storageUpdateTrack(trackId, trackData) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([STORAGE_TRACKS], (storageData = {}) => {
      const storageTracks = storageData[STORAGE_TRACKS] || {};
      storageTracks[trackId] = trackData;
      const dataToSync = {
        [STORAGE_TRACKS]: storageTracks,
      };
      chrome.storage.sync.set(dataToSync, resolve);
    });
  });
}