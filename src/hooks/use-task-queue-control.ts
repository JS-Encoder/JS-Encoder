import { noop } from "@type/interface"

type TaskKey = number | string

/**
 * 任务队列缓存执行
 * 设置一个延迟时间x(ms)，每过x(ms)清空一次任务队列
 */
const useTaskQueueControl = () => {
  let taskQueue: Array<{ task: noop, taskKey?: TaskKey }> = []
  /** 存储taskKey到taskQueue对应task的index的映射，用于查询是否有重复任务 */
  let taskKey2TaskIndexMap: Record<TaskKey, number> = {}

  const addTask = (task: noop, taskKey?: TaskKey): void => {
    if (taskKey) {
      if (taskKey2TaskIndexMap[taskKey] !== undefined) {
        const index = taskKey2TaskIndexMap[taskKey]
        taskQueue.splice(index, 1)
      }
      taskQueue.push({ task, taskKey })
      taskKey2TaskIndexMap[taskKey] = taskQueue.length - 1
    } else {
      taskQueue.push({ task })
    }
  }

  const clearTaskQueue = (): void => {
    taskQueue = []
    taskKey2TaskIndexMap = {}
  }

  const executeAndClearTaskQueue = (): void => {
    taskQueue.forEach(({ task }) => {
      task()
    })
    clearTaskQueue()
  }

  return {
    addTask,
    clearTaskQueue,
    executeAndClearTaskQueue,
  }
}

export default useTaskQueueControl