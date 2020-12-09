export const filterBoardByOption = (setFilteredBoard, board, selectedUser) => {
    // We make an array of all the tickets inside the board
    const boardsTickets = board.columns.map(column => column.tasks.concat(column.subtasks)).flat()

    // We set the initial state of the filteredBoard to be the board from the query response 
    setFilteredBoard(board)
    let filteredTicketList = []
    // We go through the array of tickets in the board and push tickets to new array which owner or member the selected user is
    boardsTickets.map(ticket => {
        if (ticket.owner && ticket.owner.userName === selectedUser) {
            filteredTicketList.push(ticket)
        } else if (ticket.members && ticket.members.find(member => member.userName === selectedUser)) {
            filteredTicketList.push(ticket)
        }
    })
    // We create an array of all the boards ticketOrderObjects
    const ticketOrderOfBoard = board.columns.map(column => column.ticketOrder).flat()
    // We create an array where we include only the ticketOrderObjects that belong to the selected user
    const filteredTicketOrder = filteredTicketList.map(ticket => ticketOrderOfBoard.find(ticketOrderObj => ticketOrderObj.ticketId === ticket.id))
    // We go through the board's columns and create a new array of their ticketOrders where we only show tickets belonging to the selected user
    const newTicketOrdersForColumns = board.columns.map(column => column.ticketOrder).map(colTicketOrderArr =>
        colTicketOrderArr.filter(colTicketOrderObj =>
            filteredTicketOrder.find(ticketOrderObj => ticketOrderObj.ticketId === colTicketOrderObj.ticketId)))
    // We create a copy of boards columns with filtered ticketOrders
    const filteredColumns = board.columns.map((column, index) => {
        column = Object.assign({}, column, { ticketOrder: newTicketOrdersForColumns[index] })
        return column
    })
    // Finally we set the filteredBoard state to be a copy of the original except for the array of columns 
    setFilteredBoard(prevState => ({ ...prevState, columns: filteredColumns }))

    return
}