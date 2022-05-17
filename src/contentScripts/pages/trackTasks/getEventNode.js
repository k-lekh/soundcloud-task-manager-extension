import {CSS_PREFIX as PREFIX} from "../../utils/constants";

export function getEventNode(event) {
  return event.currentTarget.closest(`.${PREFIX}task`);
}