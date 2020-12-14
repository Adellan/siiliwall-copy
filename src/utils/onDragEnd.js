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
    ticketsInOrderFinal,
    columnsInOrder
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

    // When task is moved within one column
    if (destination.droppableId === source.droppableId) {
        const column = columns.find((col) => col.id === source.droppableId)
        const indexForTicketOrder = columnsInOrder.findIndex(col => col.id === column.id)
        const realTicketOrderOfColumn = ticketsInOrderFinal[indexForTicketOrder].tickets.filter(ticket => ticket.column.id === column.id)
        const filteredTicketOrder = realTicketOrderOfColumn.filter(ticket => ticket.owner.userName === selectedUser || ticket.members.find(member => member.userName === selectedUser))

        if (selectedUser && realTicketOrderOfColumn.length > filteredTicketOrder.length) {
            const sourceColumnId = source.droppableId.substring(0, 36)
            // When moving ticket inside a single column in the filtered board
            const column = columns.find((col) => col.id === sourceColumnId)
            const movedTicket = realTicketOrderOfColumn.find(ticket => ticket.id === draggableId)
            const ticketMovedAside = filteredTicketOrder.find((ticket, index) => index === destination.index ? ticket : null)
            const realSourceIndex = movedTicket.index
            const realDestinationIndex = ticketMovedAside.index
            const newTicketOrder = Array.from(column.ticketOrder.map((obj) => ({ ticketId: obj.ticketId, type: obj.type })))
            const [movedTicketOrderObject] = newTicketOrder.splice(realSourceIndex, 1)
            newTicketOrder.splice(realDestinationIndex, 0, movedTicketOrderObject)

            cacheTicketMovedInColumn(column.id, newTicketOrder)

            await moveTicketInColumn({
                variables: {
                    orderArray: newTicketOrder,
                    columnId: column.id,
                    boardId: board.id,
                    eventId
                },
            })

            const snackbarMsg = movedTicket.__typename === 'Task'
                ? `Task ${movedTicket.prettyId} moved in ${column.name}`
                : `Subtask ${movedTicket.prettyId} moved in ${column.name}`

            setSnackbarMessage(snackbarMsg)

            return
        }
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

        // Handle cache updates
        cacheTicketMovedInColumn(column.id, newTicketOrder)
        // Send mutation to the server
        await moveTicketInColumn({
            variables: {
                orderArray: newTicketOrder,
                columnId: column.id,
                boardId: board.id,
                eventId
            },
        })

        setSnackbarMessage(msg)
    }

    // When ticket is moved into another column
    if (destination.droppableId !== source.droppableId) {
        const sourceColumn = columns.find((col) => col.id === source.droppableId)
        const destinationColumn = columns.find((col) => col.id === destination.droppableId)
        if (selectedUser) {
            let sourceIndex, destinationIndex
            const newTicketOrderOfSourceColumn = Array.from(sourceColumn.ticketOrder
                .map((obj) => ({ ticketId: obj.ticketId, type: obj.type })))
            const newTicketOrderOfDestinationColumn = Array.from(destinationColumn.ticketOrder
                .map((obj) => ({ ticketId: obj.ticketId, type: obj.type })))

            const indexForDestinationColumnTicketOrder = columnsInOrder.findIndex(col => col.id === destinationColumn.id)
            const realTicketOrderOfDestinationColumn = ticketsInOrderFinal[indexForDestinationColumnTicketOrder].tickets.filter(ticket => ticket.column.id === destinationColumn.id)
            const filteredDestinationTicketOrder = realTicketOrderOfDestinationColumn.filter(ticket => ticket.owner.userName === selectedUser || ticket.members.find(member => member.userName === selectedUser))

            const indexForSourceColumnTicketOrder = columnsInOrder.findIndex(col => col.id === sourceColumn.id)
            const realTicketOrderOfSourceColumn = ticketsInOrderFinal[indexForSourceColumnTicketOrder].tickets.filter(ticket => ticket.column.id === sourceColumn.id)
            const filteredSourceTicketOrder = realTicketOrderOfSourceColumn.filter(ticket => ticket.owner.userName === selectedUser || ticket.members.find(member => member.userName === selectedUser))

            const movedTicket = realTicketOrderOfSourceColumn.find(ticket => ticket.id === draggableId)

            if (!filteredDestinationTicketOrder.length) {
                sourceIndex = movedTicket.index
                destinationIndex = realTicketOrderOfDestinationColumn.length
                const [movedTicketOrderObject] = newTicketOrderOfSourceColumn.splice(sourceIndex, 1)
                newTicketOrderOfDestinationColumn.splice(destinationIndex, 0, movedTicketOrderObject)

                cacheTicketMovedFromColumn(
                    { type: movedTicketOrderObject.type, ticketId: draggableId },
                    sourceColumn.id,
                    destinationColumn.id,
                    newTicketOrderOfSourceColumn,
                    newTicketOrderOfDestinationColumn
                )
                await moveTicketFromColumn({
                    variables: {
                        type: movedTicketOrderObject.type,
                        ticketId: draggableId,
                        sourceColumnId: sourceColumn.id,
                        destColumnId: destinationColumn.id,
                        sourceTicketOrder: newTicketOrderOfSourceColumn,
                        destTicketOrder: newTicketOrderOfDestinationColumn,
                        eventId
                    },
                })
            }
            return
        }



        const newTicketOrderOfSourceColumn = Array.from(sourceColumn.ticketOrder
            .map((obj) => ({ ticketId: obj.ticketId, type: obj.type })))
        const newTicketOrderOfDestinationColumn = Array.from(destinationColumn.ticketOrder
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
        cacheTicketMovedFromColumn(
            { type: movedTicketOrderObject.type, ticketId: draggableId },
            sourceColumn.id,
            destinationColumn.id,
            newTicketOrderOfSourceColumn,
            newTicketOrderOfDestinationColumn
        )
        await moveTicketFromColumn({
            variables: {
                type: movedTicketOrderObject.type,
                ticketId: draggableId,
                sourceColumnId: sourceColumn.id,
                destColumnId: destinationColumn.id,
                sourceTicketOrder: newTicketOrderOfSourceColumn,
                destTicketOrder: newTicketOrderOfDestinationColumn,
                eventId
            },
        })
        let ticketTitle = null
        if (ticketBeingMoved.__typename === 'Subtask') {
            ticketTitle = `Subtask ${ticketBeingMoved.prettyId} moved to ${destinationColumn.name}`
        }
        if (ticketBeingMoved.__typename === 'Task') {
            ticketTitle = `Task ${ticketBeingMoved.prettyId} moved to ${destinationColumn.name}`
        }
        setSnackbarMessage(ticketTitle)
    }
}