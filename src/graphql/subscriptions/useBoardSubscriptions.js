/* eslint-disable max-len */
import { useSubscription } from '@apollo/client'
import { SUBTASK_REMOVED, SUBTASK_MUTATED } from '../subtask/subtaskQueries'
import { TASK_MUTATED, TASK_REMOVED, SWIMLANE_MOVED } from '../task/taskQueries'
import { TICKET_MOVED_IN_COLUMN, TICKET_MOVED_FROM_COLUMN } from '../ticket/ticketQueries'
import { COLUMN_EDITED, COLUMN_DELETED, COLUMN_CREATED } from '../column/columnQueries'
import {
    removeSubtaskFromCache,
    removeTaskFromCache,
    addNewSubtask,
    addNewTask,
    cacheTicketMovedInColumn,
    cacheTicketMovedFromColumn,
    deleteColumnFromCache,
    updateSwimlaneOrderOfBoardToTheCache,
    addNewColumn,
} from '../../cacheService/cacheUpdates'
import { useSnackbarContext } from '../../contexts/SnackbarContext'

const useBoardSubscriptions = (id, eventId) => {
    const { setSnackbarMessage } = useSnackbarContext()

    useSubscription(COLUMN_EDITED,
        {
            variables: { boardId: id, eventId },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                const oldName = data.columnEdited.oldName
                setSnackbarMessage(`Renamed column ${oldName}`)
            }
        })
    useSubscription(COLUMN_CREATED,
        {
            // TODO selvitä miksei kolumnin lisäys toimi subskriptioille
            variables: { boardId: id, eventId },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                console.log(data.columnCreated.column)
                const { name } = data.columnCreated.column
                addNewColumn(data.columnCreated.column)
                setSnackbarMessage(`New column ${name} created`)
            }
        })
    useSubscription(COLUMN_DELETED,
        {
            variables: { boardId: id, eventId },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                const { columnId, boardId, name } = data.columnDeleted.removeInfo
                if (data.columnDeleted.removeType === 'DELETED') {
                    deleteColumnFromCache(columnId, boardId)
                    setSnackbarMessage(`Column ${name} deleted`)
                }
            },
        })
    useSubscription(SUBTASK_REMOVED,
        {
            variables: { boardId: id, eventId },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                const { subtaskId, columnId, prettyId } = data.subtaskRemoved.removeInfo
                if (data.subtaskRemoved.removeType === 'DELETED') {
                    removeSubtaskFromCache(subtaskId, columnId)
                    setSnackbarMessage(`Subtask ${prettyId} deleted`)
                } else if (data.subtaskRemoved.removeType === 'ARCHIVED') {
                    removeSubtaskFromCache(subtaskId, columnId)
                    setSnackbarMessage(`Subtask ${prettyId} archived`)
                }
            },
        })
    useSubscription(TASK_REMOVED,
        {
            variables: { boardId: id, eventId },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                const { taskId, columnId, boardId, prettyId } = data.taskRemoved.removeInfo
                // At some point these cases will probably be handled differently
                if (data.taskRemoved.removeType === 'DELETED') {
                    removeTaskFromCache(taskId, columnId, boardId)
                    setSnackbarMessage(`Task ${prettyId} deleted`)

                } else if (data.taskRemoved.removeType === 'ARCHIVED') {
                    removeTaskFromCache(taskId, columnId, boardId)
                    setSnackbarMessage(`Task ${prettyId} archived`)
                }
            },
        })
    useSubscription(TASK_MUTATED,
        {
            variables: { boardId: id, eventId },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                // At some point different kind of actions will be taken according to the mutationType
                // For example notifying the user that something got updated when mutationType is "UPDATED"
                // At the moment the values of the UPDATE subscription response are automatically
                // updated to the cache to the correct task entity
                const type = data.taskMutated.mutationType
                const { task } = data.taskMutated
                if (type === 'CREATED') {
                    addNewTask(task)
                    setSnackbarMessage(`New task ${task.title} created`)
                } else if (type === 'UPDATED') {
                    setSnackbarMessage(`Modified task ${task.prettyId}`)
                }
            },
        })
    useSubscription(SUBTASK_MUTATED,
        {
            variables: { boardId: id, eventId },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                const { subtask } = data.subtaskMutated
                const type = data.subtaskMutated.mutationType
                if (type === 'CREATED') {
                    addNewSubtask(subtask)
                    setSnackbarMessage(`New subtask ${subtask.name} created`)
                } else if (type === 'UPDATED') {
                    setSnackbarMessage(`Modified subtask ${subtask.prettyId}`)
                }
            },
        })
    useSubscription(TICKET_MOVED_IN_COLUMN,
        {
            variables: { boardId: id, eventId },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                const { columnId, newOrder } = data.ticketMovedInColumn
                cacheTicketMovedInColumn(columnId, newOrder)
            },
        })

    useSubscription(TICKET_MOVED_FROM_COLUMN,
        {
            variables: { boardId: id, eventId },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                const {
                    ticketInfo, sourceColumnId, destColumnId, sourceTicketOrder, destTicketOrder,
                } = data.ticketMovedFromColumn
                cacheTicketMovedFromColumn(ticketInfo, sourceColumnId, destColumnId, sourceTicketOrder, destTicketOrder)
            },
        })
    useSubscription(SWIMLANE_MOVED,
        {
            variables: { boardId: id, eventId },
            onSubscriptionData: ({ subscriptionData: { data } }) => {
                const {
                    boardId, affectedSwimlanes, swimlaneOrder,
                } = data.swimlaneMoved
                updateSwimlaneOrderOfBoardToTheCache(boardId, affectedSwimlanes, swimlaneOrder)
            },
        })
}
export default useBoardSubscriptions
