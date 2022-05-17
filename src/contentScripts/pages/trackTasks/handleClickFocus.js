import {log} from "../../utils/log";
import {CSS_PREFIX as PREFIX} from "../../utils/constants";
import {storageUpdateTrack} from "../../utils/storage";
import {getNodeData} from "./getNodeData";
import {getEventNode} from "./getEventNode";

export async function handleClickFocus(e) {
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