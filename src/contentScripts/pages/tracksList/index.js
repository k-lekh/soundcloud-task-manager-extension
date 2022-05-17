import {CSS_PREFIX as PREFIX} from "../../utils/constants";
import {log} from "../../utils/log";

export async function initTracksList(nodes) {
  if (!nodes?.length) {
    return;
  }

  nodes.forEach((node) => initTrackListItem(node));
}

function initTrackListItem(node) {
  node.classList.add(`${PREFIX}track`);
  const linkNode = node.querySelector('a.soundTitle__title');
  const nodeTrackId = linkNode.href;
  if (!nodeTrackId) {
    return;
  }

  log('>> initTrackListItem', { nodeTrackId });
}