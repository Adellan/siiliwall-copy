/* eslint-disable array-callback-return */
/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import { client } from '../apollo'
import {
    TICKETORDER_AND_TASKS,
    SWIMLANE_ORDER,
    TICKETORDER,
    SUBTASKS,
    COLUMNORDER,
    TICKETORDER_AND_SUBTASKS,
    SUBTASKS_COLUMN,
    SWIMLANE_ORDER_NUMBER,
    PROJECTS_BOARDS,
    COLUMNORDER_AND_COLUMNS,
} from '../graphql/fragments'

export const addNewColumn = (addedColumn) => {
    const boardIdForCache = `Board:${addedColumn.board.id}`
    const { columnOrder, columns } = client.readFragment({
        id: boardIdForCache,
        fragment: COLUMNORDER_AND_COLUMNS,
    })
    const newColumns = columns.concat(addedColumn)
    const newColumnOrder = columnOrder.concat(addedColumn.id)
    client.writeFragment({
        id: boardIdForCache,
        fragment: COLUMNORDER_AND_COLUMNS,
        data: {
            columnOrder: newColumnOrder,
            columns: newColumns,
        },
    })
}

export const addNewBoard = (addedBoard, projectId) => {
    const projectIdForCache = `Project:${projectId}`
    const { boards } = client.readFragment({
        id: projectIdForCache,
        fragment: PROJECTS_BOARDS,
    })
    const newBoards = boards.concat(addedBoard)
    client.writeFragment({
        id: projectIdForCache,
        fragment: PROJECTS_BOARDS,
        data: {
            boards: newBoards,
        },
    })
}

export const addNewTask = (addedTask) => {
    // Update the column's tasks and ticketOrder lists
    const columnIdForCache = `Column:${addedTask.column.id}`
    const { ticketOrder, tasks } = client.readFragment({
        id: columnIdForCache,
        fragment: TICKETORDER_AND_TASKS,
    })
    const newTasks = tasks.concat(addedTask)
    const newTicketOrder = ticketOrder.concat({ ticketId: addedTask.id, type: 'task' })
    client.writeFragment({
        id: columnIdForCache,
        fragment: TICKETORDER_AND_TASKS,
        data: {
            ticketOrder: newTicketOrder,
            tasks: newTasks,
        },
    })
    // Update the board's swimlaneOrder
    const boardIdForCache = `Board:${addedTask.board.id}`
    const { swimlaneOrder } = client.readFragment({
        id: boardIdForCache,
        fragment: SWIMLANE_ORDER,
    })
    const newSwimlaneOrder = swimlaneOrder.concat(addedTask.id)
    client.writeFragment({
        id: boardIdForCache,
        fragment: SWIMLANE_ORDER,
        data: {
            swimlaneOrder: newSwimlaneOrder,
        },
    })
}

export const removeTaskFromCache = (taskId, columnId, boardId) => {
    // Deleting task affects column's tasks list, column's ticketOrder list and board's swimlaneOrder list
    // In addition the normalized cache object is deleted itself
    const taskToBeDeleted = `Task:${taskId}`
    const columnIdForCache = `Column:${columnId}`
    const boardIdForCache = `Board:${boardId}`
    const { ticketOrder, tasks } = client.readFragment({
        id: columnIdForCache,
        fragment: TICKETORDER_AND_TASKS,
    })

    const newTicketOrder = ticketOrder.filter((taskObj) => taskObj.ticketId !== taskId)
    const newTasks = tasks.filter((task) => task.id !== taskId)
    client.writeFragment({
        id: columnIdForCache,
        fragment: TICKETORDER_AND_TASKS,
        data: {
            ticketOrder: newTicketOrder,
            tasks: newTasks,
        },
    })
    // Delete related taskId from the board's swimlaneOrder list
    const { swimlaneOrder } = client.readFragment({
        id: boardIdForCache,
        fragment: SWIMLANE_ORDER,
    })
    const newSwimlaneOrder = swimlaneOrder.filter((id) => id !== taskId)
    client.writeFragment({
        id: boardIdForCache,
        fragment: SWIMLANE_ORDER,
        data: {
            swimlaneOrder: newSwimlaneOrder,
        },
    })
    // Delete normalized object itself
    client.cache.evict({ id: taskToBeDeleted })
}

export const removeSubtaskFromCache = (subtaskId, columnId) => {
    // fetch certain column from the cache
    const columnIdForCache = `Column:${columnId}`
    const { ticketOrder, subtasks } = client.readFragment({
        id: columnIdForCache,
        fragment: TICKETORDER_AND_SUBTASKS,
    })
    // update column's ticketOrder and subtasks
    const newSubtasks = subtasks.filter((subtask) => subtask.id !== subtaskId)
    const newTicketOrder = ticketOrder.filter((obj) => obj.ticketId !== subtaskId)

    client.writeFragment({
        id: columnIdForCache,
        fragment: TICKETORDER_AND_SUBTASKS,
        data: {
            ticketOrder: newTicketOrder,
            subtasks: newSubtasks,
        },
    })
    // finally remove the normalized subtask entity
    const subtaskIdForCache = `Subtask:${subtaskId}`
    client.cache.evict({
        id: subtaskIdForCache,
    })
}

export const deleteColumnFromCache = (columnId, boardId) => {
    const idToBeDeleted = `Column:${columnId}`
    const boardIdForCache = `Board:${boardId}`
    const data = client.readFragment({
        id: boardIdForCache,
        fragment: COLUMNORDER,
    })
    const newColumnOrder = data.columnOrder.filter((id) => id !== columnId)

    client.writeFragment({
        id: boardIdForCache,
        fragment: COLUMNORDER,
        data: {
            columnOrder: newColumnOrder,
        },
    })
    client.cache.evict({ id: idToBeDeleted })
}

export const addNewSubtask = (addedSubtask) => {
    const columnIdForCache = `Column:${addedSubtask.column.id}`
    const cached = client.readFragment({
        id: columnIdForCache,
        fragment: SUBTASKS,
    })
    const { subtasks } = cached
    const newSubtasks = subtasks.concat(addedSubtask)
    client.writeFragment({
        id: columnIdForCache,
        fragment: SUBTASKS,
        data: {
            subtasks: newSubtasks,
        },
    })
}

export const cacheTicketMovedInColumn = (columnId, newOrder) => {
    const columnIdForCache = `Column:${columnId}`
    client.writeFragment({
        id: columnIdForCache,
        fragment: TICKETORDER,
        data: {
            ticketOrder: newOrder,
        },
    })
}

const updateTheColumnOfTheMovedSubtask = (ticketId, columnId) => {
    const newColumnForMovedSubtask = { id: columnId, __typename: 'Column' }

    client.writeFragment({
        id: `Subtask:${ticketId}`,
        fragment: SUBTASKS_COLUMN,
        data: {
            column: newColumnForMovedSubtask,
        },
    })
}

export const cacheTicketMovedFromColumn = (ticketInfo, sourceColumnId, destColumnId, sourceTicketOrder, destTicketOrder) => {
    // Column attribute of the moved subtask has to be updated to the
    // cache in order to avoid lagging when subtask is moved
    updateTheColumnOfTheMovedSubtask(ticketInfo.ticketId, destColumnId)
    const sourceColumnIdForCache = `Column:${sourceColumnId}`
    const destinationColumnIdForCache = `Column:${destColumnId}`
    const sourceColumn = client.readFragment({
        id: sourceColumnIdForCache,
        fragment: ticketInfo.type === 'task' ? TICKETORDER_AND_TASKS : TICKETORDER_AND_SUBTASKS,
    })
    const destinationColumn = client.readFragment({
        id: destinationColumnIdForCache,
        fragment: ticketInfo.type === 'task' ? TICKETORDER_AND_TASKS : TICKETORDER_AND_SUBTASKS,
    })

    if (ticketInfo.type === 'task') {
        const newSourceTasks = Array.from(sourceColumn.tasks).filter((task) => task.id !== ticketInfo.ticketId)
        const movedTicket = sourceColumn.tasks.find((task) => task.id === ticketInfo.ticketId)
        const newDestinationTasks = Array.from(destinationColumn.tasks).concat(movedTicket)
        client.writeFragment({
            id: sourceColumnIdForCache,
            fragment: TICKETORDER_AND_TASKS,
            data: {
                ticketOrder: sourceTicketOrder,
                tasks: newSourceTasks,
            },
        })
        client.writeFragment({
            id: destinationColumnIdForCache,
            fragment: TICKETORDER_AND_TASKS,
            data: {
                ticketOrder: destTicketOrder,
                tasks: newDestinationTasks,
            },
        })
    } else {
        const newSourceSubtasks = Array.from(sourceColumn.subtasks).filter((subtask) => subtask.id !== ticketInfo.ticketId)
        const movedTicket = sourceColumn.subtasks.find((subtask) => subtask.id === ticketInfo.ticketId)
        const newDestinationSubtasks = Array.from(destinationColumn.subtasks).concat(movedTicket)

        client.writeFragment({
            id: sourceColumnIdForCache,
            fragment: TICKETORDER_AND_SUBTASKS,
            data: {
                ticketOrder: sourceTicketOrder,
                subtasks: newSourceSubtasks,
            },
        })
        client.writeFragment({
            id: destinationColumnIdForCache,
            fragment: TICKETORDER_AND_SUBTASKS,
            data: {
                ticketOrder: destTicketOrder,
                subtasks: newDestinationSubtasks,
            },
        })
    }
}

export const updateSwimlaneOrderOfBoardToTheCache = (boardId, affectedSwimlanes, newSwimlaneOrder) => {
    client.writeFragment({
        id: `Board:${boardId}`,
        fragment: SWIMLANE_ORDER,
        data: {
            swimlaneOrder: newSwimlaneOrder,
        },
    })

    // Update the swimlaneOrderNumbers of the affected tasks to the cache
    affectedSwimlanes.map((task) => {
        client.writeFragment({
            id: `Task:${task.id}`,
            fragment: SWIMLANE_ORDER_NUMBER,
            data: {
                swimlaneOrderNumber: task.swimlaneOrderNumber,
            },
        })
    })
}

export const cacheColumnMoved = (boardId, newColumnOrder) => {
    const boardIdForCache = `Board:${boardId}`
    client.writeFragment({
        id: boardIdForCache,
        fragment: COLUMNORDER,
        data: {
            columnOrder: newColumnOrder,
        },
    })
}
