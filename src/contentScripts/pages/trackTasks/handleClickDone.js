import {log} from "../../utils/log";
import {CSS_PREFIX as PREFIX} from "../../utils/constants";
import {storageUpdateTrack} from "../../utils/storage";
import {getNodeData} from "./getNodeData";
import {getEventNode} from "./getEventNode";

export async function handleClickDone(e) {
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
