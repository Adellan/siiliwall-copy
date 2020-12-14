export const filterBoardByUserName = (selectedUser, tasks, subtasks, ticketOrder) => {
    let selectedUsersSubtasks,
        selectedUsersTasks,
        filteredUserIsOwner,
        filteredUserIsMember
    // If there are subtask's in the column we want to know which of those belong to the selected user
    if (subtasks) {
        selectedUsersSubtasks = subtasks.filter(subtask => {
            filteredUserIsMember = subtask.members.some(member => member.userName === selectedUser)
            if (subtask.owner) {
                filteredUserIsOwner = subtask.owner.userName === selectedUser ? true : false
            }
            if (filteredUserIsMember || filteredUserIsOwner) {
                return subtask
            }
            return null
        })
        selectedUsersSubtasks = selectedUsersSubtasks.map(subtask => {
            const subtaskWithType = { ...subtask, type: 'subtask', realIndex: ticketOrder.findIndex(obj => obj.ticketId === subtask.id) }
            return subtaskWithType
        })
    }
    // If there are task's in the column we want to know which of those belong to the selected user
    if (tasks) {
        selectedUsersTasks = tasks.filter(task => {
            filteredUserIsMember = task.members.some(member => member.userName === selectedUser)
            if (task.owner) {
                filteredUserIsOwner = task.owner.userName === selectedUser ? true : false
            }
            if (filteredUserIsMember || filteredUserIsOwner) {
                return task
            }
            return null
        })
        selectedUsersTasks = selectedUsersTasks.map(task => {
            const taskWithType = { ...task, type: 'task', realIndex: ticketOrder.findIndex(obj => obj.ticketId === task.id) }
            return taskWithType
        })
    }

    // We want to put the two array together to the TicketList component to sort out
    const filteredTicketObjectArray = selectedUsersTasks.concat(selectedUsersSubtasks)
    const updatedTicketOrder = ticketOrder.filter(ticketOrderObj => filteredTicketObjectArray.find(ticket => ticket.id === ticketOrderObj.ticketId))
    const finalTicketObjectArray = updatedTicketOrder.map(ticketOrderObj => filteredTicketObjectArray.find(ticket => ticket.id === ticketOrderObj.ticketId))

    return finalTicketObjectArray
}