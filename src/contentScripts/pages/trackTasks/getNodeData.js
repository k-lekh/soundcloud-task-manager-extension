import {CSS_PREFIX as PREFIX} from "../../utils/constants";
import {storageGetTrack} from "../../utils/storage";

export async function getNodeData(node) {
  const trackId = node.dataset[`${PREFIX}trackId`];
  const taskId = node.dataset[`${PREFIX}taskId`];
  const trackData = await storageGetTrack(trackId);
  return {
    trackId,
    taskId,
    trackData,
  }
}