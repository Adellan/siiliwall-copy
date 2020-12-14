/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
import {
    COLUMNORDER,
} from '../graphql/fragments'
import { cacheTicketMovedInColumn, cacheTicketMovedFromColumn } from '../cacheService/cacheUpdates'

export const onDragEnd = async (
    result,
    moveTicketInColumn,
    moveTicketFromColumn,
    moveColumn,
    client,
    columns,
    board,
    setSnackbarMessage,
    selectedUser,
) => {
    const { destination, source, draggableId } = result
    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    const eventId = window.localStorage.getItem("eventId")

    // When user is moving column
    if (result.type === 'column') {
        const newColumnOrder = Array.from(board.columnOrder)
        newColumnOrder.splice(source.index, 1)
        newColumnOrder.splice(destination.index, 0, draggableId)
        const colName = board.columns.filter((b) => b.id === draggableId).map((c) => c.name)

        const boardId = `Board:${board.id}`
        client.writeFragment({
            id: boardId,
            fragment: COLUMNORDER,
            data: {
                columnOrder: newColumnOrder,
            },
        })

        await moveColumn({
            variables: {
                orderArray: newColumnOrder,
                boardId: board.id,
                eventId
            },
        })
        let msg = `Moved column ${colName}`
        setSnackbarMessage(msg)
        return
    }

    const ticketMovedInColumn = async (columnId, newTicketOrder) => {
        cacheTicketMovedInColumn(columnId, newTicketOrder)
        await moveTicketInColumn({
            variables: {
                orderArray: newTicketOrder,
                columnId: columnId,
                boardId: board.id,
                eventId
            },
        })
    }

    const ticketMovedFromColumn = async (
        movedTicketOrderObject,
        sourceColumnId,
        destinationColumnId,
        newTicketOrderOfSourceColumn,
        newTicketOrderOfDestinationColumn
    ) => {
        cacheTicketMovedFromColumn(
            { type: movedTicketOrderObject.type, ticketId: draggableId },
            sourceColumnId,
            destinationColumnId,
            newTicketOrderOfSourceColumn,
            newTicketOrderOfDestinationColumn
        )
        await moveTicketFromColumn({
            variables: {
                type: movedTicketOrderObject.type,
                ticketId: draggableId,
                sourceColumnId: sourceColumnId,
                destColumnId: destinationColumnId,
                sourceTicketOrder: newTicketOrderOfSourceColumn,
                destTicketOrder: newTicketOrderOfDestinationColumn,
                eventId
            },
        })
    }

    // When task is moved within one column
    if (destination.droppableId === source.droppableId) {
        const column = columns.find((col) => col.id === source.droppableId)
        const newTicketOrder = Array.from(column.ticketOrder.map((obj) => (
            { ticketId: obj.ticketId, type: obj.type })))
        const movedTicket = newTicketOrder.splice(source.index, 1)
        newTicketOrder.splice(destination.index, 0, movedTicket[0])

        let msg = null
        let ticketPrettyId = null
        if (movedTicket[0]?.type === 'task') {
            ticketPrettyId = column.tasks.filter((t) => t.id === movedTicket[0]?.ticketId)
                .map((f) => f.prettyId)
            msg = `Task ${ticketPrettyId} moved in ${column.name}`
        }
        if (movedTicket[0]?.type === 'subtask') {
            let stask = column.subtasks.map((s) => s.task)
            ticketPrettyId = stask[0]?.prettyId
            const subtask = column.subtasks.find((s) => s.id === movedTicket[0]?.ticketId)
            msg = `Subtask ${subtask.prettyId} moved in ${column.name}`
        }

        // Handle cache updates and send mutation to the server
        ticketMovedInColumn(column.id, newTicketOrder)

        setSnackbarMessage(msg)
    }

    // When ticket is moved into another column
    if (destination.droppableId !== source.droppableId) {
        const sourceColumn = columns.find((col) => col.id === source.droppableId)
        const destinationColumn = columns.find((col) => col.id === destination.droppableId)
        let newTicketOrderOfSourceColumn, newTicketOrderOfDestinationColumn
        const destinationColumnTickets = destinationColumn.subtasks.concat(destinationColumn.tasks)
        const filteredDestinationTicketOrder = destinationColumnTickets
            .filter(ticket => ticket.owner.userName === selectedUser || ticket.members.find(member => member.userName === selectedUser))

        /*
        If ticket is being moved into a column where there are no filtered user's tickets we want to
        put it below every other ticket in that column. We cannot use the destination.index that the dragNdrop provides because it would be 0
        so we use the length of the columns ticketOrder as the destination index.
        */
        if (!filteredDestinationTicketOrder.length) {
            newTicketOrderOfSourceColumn = Array.from(sourceColumn.ticketOrder
                .map((obj) => ({ ticketId: obj.ticketId, type: obj.type })))
            newTicketOrderOfDestinationColumn = Array.from(destinationColumn.ticketOrder
                .map((obj) => ({ ticketId: obj.ticketId, type: obj.type })))

            const destinationIndex = destinationColumn.ticketOrder.length
            const [movedTicketOrderObject] = newTicketOrderOfSourceColumn.splice(source.index, 1)
            newTicketOrderOfDestinationColumn.splice(destinationIndex, 0, movedTicketOrderObject)

            const sourceColumnTickets = sourceColumn.subtasks.concat(sourceColumn.tasks)
            const movedTicket = sourceColumnTickets.find(ticket => ticket.id === movedTicketOrderObject.ticketId)

            let snackbarMessage = null
            if (movedTicket.__typename === 'Subtask') {
                snackbarMessage = `Subtask ${movedTicket.prettyId} moved to ${destinationColumn.name}`
            }
            if (movedTicket.__typename === 'Task') {
                snackbarMessage = `Task ${movedTicket.prettyId} moved to ${destinationColumn.name}`
            }
            ticketMovedFromColumn(
                movedTicketOrderObject,
                sourceColumn.id,
                destinationColumn.id,
                newTicketOrderOfSourceColumn,
                newTicketOrderOfDestinationColumn
            )

            setSnackbarMessage(snackbarMessage)
        } else {
            newTicketOrderOfSourceColumn = Array.from(sourceColumn.ticketOrder
                .map((obj) => ({ ticketId: obj.ticketId, type: obj.type })))
            newTicketOrderOfDestinationColumn = Array.from(destinationColumn.ticketOrder
                .map((obj) => ({ ticketId: obj.ticketId, type: obj.type })))

            const [movedTicketOrderObject] = newTicketOrderOfSourceColumn.splice(source.index, 1)
            newTicketOrderOfDestinationColumn.splice(destination.index, 0, movedTicketOrderObject)

            // Find the columns being manipulated
            const sourceColumnFromCache = columns
                .find((column) => column.id === sourceColumn.id)
            const destinationColumnFromCache = columns
                .find((column) => column.id === destinationColumn.id)

            // Combine the tasks and the subtasks into single array
            const ticketsOfSourceColumn = sourceColumnFromCache.tasks
                .concat(sourceColumnFromCache.subtasks)
            const ticketsOfDestinationColumn = destinationColumnFromCache.tasks
                .concat(destinationColumnFromCache.subtasks)
            // Find the ticket being moved using draggableId
            const ticketBeingMoved = ticketsOfSourceColumn.find((ticket) => ticket.id === draggableId)

            // From the source column filter out the moved ticket using draggableId
            const updatedTicketsOfSourceColumn = ticketsOfSourceColumn
                .filter((ticket) => ticket.id !== draggableId)
            // To the destination column add the moved task
            // tällä ticketillä ei ole tässä kohtaa uutta columnId:tä ja se pitäii sille saada
            // uutta columnId:tä ei tarvitse renderöitiin siihen käytetään columnin subtask saraketta
            // sen vois päivittää vaikka mutaation update callbackissa vähän alempana
            const updatedTicketsOfDestinationColumn = ticketsOfDestinationColumn
                .concat(ticketBeingMoved)

            const updatedTasksOfSourceColumn = []
            const updatedTasksOfDestinationColumn = []
            const updatedSubtasksOfSourceColumn = []
            const updatedsubtasksOfDestinationColumn = []

            updatedTicketsOfSourceColumn.forEach((ticket) => {
                if (ticket.__typename === 'Task') {
                    updatedTasksOfSourceColumn.push(ticket)
                } else if (ticket.__typename === 'Subtask') {
                    updatedSubtasksOfSourceColumn.push(ticket)
                }
            })

            updatedTicketsOfDestinationColumn.forEach((ticket) => {
                if (ticket.__typename === 'Task') {
                    updatedTasksOfDestinationColumn.push(ticket)
                } else if (ticket.__typename === 'Subtask') {
                    updatedsubtasksOfDestinationColumn.push(ticket)
                }
            })

            // update the manipulated columns in the cache
            ticketMovedFromColumn(
                movedTicketOrderObject,
                sourceColumn.id,
                destinationColumn.id,
                newTicketOrderOfSourceColumn,
                newTicketOrderOfDestinationColumn
            )

            let snackbarMessage = null
            if (ticketBeingMoved.__typename === 'Subtask') {
                snackbarMessage = `Subtask ${ticketBeingMoved.prettyId} moved to ${destinationColumn.name}`
            }
            if (ticketBeingMoved.__typename === 'Task') {
                snackbarMessage = `Task ${ticketBeingMoved.prettyId} moved to ${destinationColumn.name}`
            }
            setSnackbarMessage(snackbarMessage)
        }
    }
}
