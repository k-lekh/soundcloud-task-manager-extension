const STORAGE_TRACKS = "tracks";
const PREFIX = '__sctmext__';
const isDev = false;
const log = isDev ? console.log.bind(console) : () => undefined;

const tasksToInit = {};

const getTrackId = () => document.location.pathname;

// TODO migration from 1.1
async function storageGetTrack(trackId) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([STORAGE_TRACKS], (storageData = {}) => {
      const storageTracks = storageData[STORAGE_TRACKS] || {};
      const trackData = storageTracks[trackId] || {};
      resolve(trackData);
    });
  });
}

async function storageUpdateTrack(trackId, trackData) {
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

const observer = new MutationObserver(handleMutation);
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// TODO debounce
async function handleMutation() {
  const nodes = document.querySelectorAll(`.commentsList__item:not(.${PREFIX}task)`);
  if (!nodes?.length) {
    return;
  }

  const trackId = getTrackId();
  const trackData = await storageGetTrack(trackId);
  log('>> handleMutation', {trackId, trackData, nodes});
  nodes.forEach((node) => initTask(node, {trackId, trackData}));
}

function initTask(node, {trackId, trackData = {}}) {
  const userName = node.querySelector('.commentItem__usernameLink')?.innerText || '';
  const timeLink = node.querySelector('.commentItem__timestampLink')?.innerText || '';
  const commentText = node.querySelector('.commentItem__body p')?.innerText;
  if (!commentText) {
    log('>> initTask: empty commentText', node);
    return;
  }

  const taskId = [userName, timeLink, commentText].join('|'); // TODO use hash
  if (tasksToInit[trackId]?.[taskId]) {
    return;
  }

  tasksToInit[trackId] = tasksToInit[trackId] || {};
  tasksToInit[trackId][taskId] = true;
  log('>> initTask', {trackId, taskId, userName, timeLink, commentText, node});

  node.classList.add(`${PREFIX}task`);
  node.dataset[`${PREFIX}trackId`] = trackId;
  node.dataset[`${PREFIX}taskId`] = taskId;
  node.querySelector('.commentItem__body')?.addEventListener('click', handleClickDone);

  const ignoreButton = document.createElement('button');
  ignoreButton.classList.add('sc-button', 'sc-button-secondary', 'sc-button-responsive', 'sc-button-small', `${PREFIX}task__button`, `${PREFIX}task__button_ignore`);
  ignoreButton.textContent = 'Ignore';
  ignoreButton.onclick = handleClickIgnore;
  node.querySelector('.commentItem__controls')?.prepend(ignoreButton);

  const focusButton = document.createElement('button');
  focusButton.classList.add('sc-button', 'sc-button-secondary', 'sc-button-responsive', 'sc-button-small', `${PREFIX}task__button`, `${PREFIX}task__button_focus`);
  focusButton.textContent = 'Focus';
  focusButton.onclick = handleClickFocus;
  node.querySelector('.commentItem__controls')?.prepend(focusButton);

  const { done = {}, focused = {}, ignored = {} } = trackData;
  if (done[taskId]) {
    node.classList.add(`${PREFIX}task_done`);
  }
  if (focused[taskId]) {
    node.classList.add(`${PREFIX}task_focused`);
  }
  if (ignored[taskId]) {
    node.classList.add(`${PREFIX}task_ignored`);
  }
}

function getEventNode(event) {
  return event.currentTarget.closest(`.${PREFIX}task`);
}

async function getNodeData(node) {
  const trackId = node.dataset[`${PREFIX}trackId`];
  const taskId = node.dataset[`${PREFIX}taskId`];
  const trackData = await storageGetTrack(trackId);
  return {
    trackId,
    taskId,
    trackData,
  }
}

async function handleClickDone(e) {
  e.preventDefault();

  const taskNode = getEventNode(e);
  if (!taskNode) {
    return;
  }

  const {
    trackId,
    taskId,
    trackData,
  } = await getNodeData(taskNode);

  const wasDone = Boolean(trackData.done?.[taskId]);
  log('>> handleClickDone', {taskId, trackId, wasDone});

  if (wasDone) {
    taskNode.classList.remove(`${PREFIX}task_done`);
    delete trackData.done?.[taskId];
  } else {
    taskNode.classList.add(`${PREFIX}task_done`);
    trackData.done = trackData.done || {};
    trackData.done[taskId] = Date.now();
  }

  await storageUpdateTrack(trackId, trackData);
}

async function handleClickIgnore(e) {
  e.preventDefault();

  const taskNode = getEventNode(e);
  if (!taskNode) {
    return;
  }

  const {
    trackId,
    taskId,
    trackData,
  } = await getNodeData(taskNode);

  const wasIgnored = Boolean(trackData.ignored?.[taskId]);
  log('>> handleClickIgnore', {taskId, trackId, wasIgnored});

  if (wasIgnored) {
    taskNode.classList.remove(`${PREFIX}task_ignored`);
    delete trackData.ignored?.[taskId];
  } else {
    taskNode.classList.add(`${PREFIX}task_ignored`);
    trackData.ignored = trackData.ignored || {};
    trackData.ignored[taskId] = Date.now();
  }

  await storageUpdateTrack(trackId, trackData);
}

async function handleClickFocus(e) {
  e.preventDefault();

  const taskNode = getEventNode(e);
  if (!taskNode) {
    return;
  }

  const {
    trackId,
    taskId,
    trackData,
  } = await getNodeData(taskNode);

  const wasFocused = Boolean(trackData.focused?.[taskId]);
  log('>> handleClickFocus', {taskId, trackId, wasFocused});

  document.querySelectorAll(`.${PREFIX}task_focused`).forEach((node) => {
    node.classList.remove(`${PREFIX}task_focused`);
  });

  if (wasFocused) {
    delete trackData.focused?.[taskId];
  } else {
    taskNode.classList.add(`${PREFIX}task_focused`);
    trackData.focused = {
      [taskId]: Date.now(),
    };
  }

  await storageUpdateTrack(trackId, trackData);
}
