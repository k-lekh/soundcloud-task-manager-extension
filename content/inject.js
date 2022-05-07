const updateTasks = () => {
  const nodes = document.querySelectorAll('.commentsList .commentsList__item .commentItem__body span p');
  console.log('>> nodes', nodes);

  if (!nodes || !nodes.length) {
    console.log('>> no comments found');
    return;
  }

  const trackId = document.location.pathname;
  const storageId = `trackTasks__${trackId}`;
  console.log('>> storageId', storageId);

  let trackTasks = {};
  chrome.storage.sync.get([storageId], (storageData = {}) => {
    trackTasks = storageData[storageId] || {};
    console.log('>> trackTasks', trackTasks);

    nodes.forEach((node) => {
      node.classList.add('__sctmext__task');
      const text = node.innerText;
      if (trackTasks[text]) {
        node.classList.add('__sctmext__task_done');
      }

      node.addEventListener('click', (e) => {
        if (node.classList.contains('__sctmext__task_done')) {
          delete trackTasks[text];
          node.classList.remove('__sctmext__task_done');
        } else {
          trackTasks[text] = Date.now();
          node.classList.add('__sctmext__task_done');
        }

        const dataToSync = {
          [storageId]: trackTasks,
        };
        console.log('>> dataToSync', dataToSync);
        chrome.storage.sync.set(dataToSync, () => {
          console.log('>> synced');
        });
      })
    });
  });
}

const MAX_WAIT_MS = 5000;
const CHECK_INTERVAL_MS = 1000;

const startTime = Date.now();
const waitForCommentList = () => {
  const list = document.querySelector('.commentsList');
  console.log('>> list', list, list?.length);
  if (list !== null) {
    updateTasks();
  } else if (Date.now() - startTime < MAX_WAIT_MS) {
    setTimeout(waitForCommentList, CHECK_INTERVAL_MS);
  } else {
    console.log('>> comments list not found')
  }
}
setTimeout(waitForCommentList, CHECK_INTERVAL_MS);

