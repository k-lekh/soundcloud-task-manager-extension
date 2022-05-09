// [ ] use redux
// [ ] use typescript

const prefix = '__sctmext__';

const syncSet = ({trackTasks}) => {
  return;

  const dataToSync = {
    [storageId]: trackTasks,
  };
  console.log('>> dataToSync', dataToSync);
  chrome.storage.sync.set(dataToSync, () => {
    console.log('>> synced');
  });
}

const setFocusedNode = ({nodes, node, trackTasks}) => {
  nodes.forEach((node) => node.classList.remove(`${prefix}item_focused`));
  if (node) {
    node.classList.add(`${prefix}task_focused`);
    syncSet({trackTasks, focusedTrack: node.innerText});
  } else {
    syncSet({trackTasks, focusedTrack: undefined});
  }
}

const initNode = ({nodes, node, trackTasks, focusedTrack}) => {
  node.classList.add(`${prefix}task`);
  const text = node.innerText;
  if (trackTasks[text]) {
    node.classList.add(`${prefix}task_done`);
  }
  if (text === focusedTrack) {
    node.closest('.commentItem').classList.add(`${prefix}task_focused`);
  }

  // const focusButton = document.createElement('button');
  // focusButton.innerText = '⊙ Focus on this'
  // focusButton.classList.add(`${prefix}task__focusButton`);
  // focusButton.onclick = (e) => {
  //   e.preventDefault();
  //   const activeClass = `${prefix}task__focusButton_active`;
  //   const isActive = e.target.classList.contains(activeClass);
  //   if (isActive) {
  //     e.target.classList.remove(activeClass);
  //     setFocusedNode({nodes, node: undefined, trackTasks});
  //   } else {
  //     e.target.classList.add(activeClass);
  //     setFocusedNode({nodes, node, trackTasks});
  //   }
  // }
  // focusButton.classList.add(`${prefix}task__focusButton`);
  // node.appendChild(focusButton);

  node.addEventListener('click', (e) => {
    if (node.classList.contains(`${prefix}task_done`)) {
      delete trackTasks[text];
      node.classList.remove(`${prefix}task_done`);
    } else {
      trackTasks[text] = Date.now();
      node.classList.add(`${prefix}task_done`);
    }

    syncSet({trackTasks});
  })
};

const updateTasks = () => {
  // [ ] add task "listen this track and write comments right here"
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

    nodes.forEach((node) => initNode({nodes, node, trackTasks}));
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

