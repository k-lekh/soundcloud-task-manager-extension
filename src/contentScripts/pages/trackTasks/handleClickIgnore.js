import {log} from "../../utils/log";
import {CSS_PREFIX as PREFIX} from "../../utils/constants";
import {storageUpdateTrack} from "../../utils/storage";
import {getNodeData} from "./getNodeData";
import {getEventNode} from "./getEventNode";

export async function handleClickIgnore(e) {
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