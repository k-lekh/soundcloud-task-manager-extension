import {log} from "../../utils/log";
import {getTaskId} from "../../utils";
import {CSS_PREFIX as PREFIX} from "../../utils/constants";
import {handleClickFocus} from "./handleClickFocus";
import {handleClickIgnore} from "./handleClickIgnore";
import {handleClickDone} from "./handleClickDone";
import {storageGetTrack} from "../../utils/storage";

const tasksToInit = {};

export async function initTrackTasks(nodes) {
  if (!nodes?.length) {
    return;
  }

  const trackId = document.location.pathname;
  const trackData = await storageGetTrack(trackId);
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

  const taskId = getTaskId({userName, timeLink, commentText });
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

  const {done = {}, focused = {}, ignored = {}} = trackData;
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