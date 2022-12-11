import debounce from 'lodash.debounce';
import {log} from "./utils/log";
import { CSS_PREFIX as PREFIX } from './utils/constants';
import {initTrackTasks} from "./pages/trackTasks";
import {initTracksList} from "./pages/tracksList";

import { migrations } from './utils/migrations';

async function handleBodyMutation() {
  const trackTasksNodes = document.querySelectorAll(`.commentsList__item:not(.${PREFIX}task)`);
  initTrackTasks(trackTasksNodes).then(() => log('>> initTrackTasks:done'));

  const trackListNodes = document.querySelectorAll(`.trackManagerTrackList__item:not(.${PREFIX}trackItem)`);
  initTracksList(trackListNodes).then(() => log('>> initTracksList:done'));

  log('>> handleMutation', { trackTasksNodes, trackListNodes });
}

(async () => {
  await migrations();

  const observer = new MutationObserver(debounce(handleBodyMutation, 200));
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();