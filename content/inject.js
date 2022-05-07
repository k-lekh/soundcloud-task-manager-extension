const updateTasks = () => {
  const tasks = document.querySelectorAll('.commentsList .commentsList__item .commentItem__body span p');
  console.log('>> tasks', tasks);

  tasks.forEach((task) => {
    task.classList.add('__sctmext__task');
    task.addEventListener('click', () => {
      task.classList.toggle('__sctmext__task_done');
    })
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