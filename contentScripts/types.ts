export interface TasksToInit {
  [trackId: string]: {
    [taskId: string]: true | undefined;
  }
}

export interface Storage {
  tracks: {
    [trackId: string]: {
      done: {
        [taskId: string]: number;
      },
      focused: {
        [taskId: string]: number;
      },
      ignored: {
        [taskId: string]: number;
      },
    }
  }
}