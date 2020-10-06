import { useMutation } from '@apollo/client'
import { ARCHIVE_TASK } from '../taskQueries'
import { TICKETORDER_AND_TASKS } from '../../fragments'

const useArchiveTask = (columnId) => {
    const retVal = useMutation(ARCHIVE_TASK, {
        update: async (cache, response) => {
            const columnIdForCache = `Column:${columnId}`
            const cached = cache.readFragment({
                id: columnIdForCache,
                fragment: TICKETORDER_AND_TASKS,
            })
            const { tasks, ticketOrder } = cached
            const taskIdToBeRemoved = response.data.archiveTaskById
            const taskIdForCache = `Task:${taskIdToBeRemoved}`
            const newTasks = tasks.filter((task) => task.id !== taskIdToBeRemoved)
            const newTicketOrder = ticketOrder.filter((obj) => obj.ticketId !== taskIdToBeRemoved)

            cache.writeFragment({
                id: columnIdForCache,
                fragment: TICKETORDER_AND_TASKS,
                data: {
                    ticketOrder: newTicketOrder,
                    tasks: newTasks,
                },
            })
            cache.evict({
                id: taskIdForCache,
            })
        },
    })
    return retVal
}
export default useArchiveTask
