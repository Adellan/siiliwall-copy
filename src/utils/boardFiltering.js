export const filterBoardByUserName = (selectedUser, tasks, subtasks) => {
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
            return
        })
        selectedUsersSubtasks = selectedUsersSubtasks.map(subtask => {
            const subtaskWithType = { ...subtask, type: 'subtask' }
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
            return
        })
        selectedUsersTasks = selectedUsersTasks.map(task => {
            const taskWithType = { ...task, type: 'task' }
            return taskWithType
        })
    }
    // We want to put the two array together to the TicketList component to sort out
    const filteredTicketObjectArray = selectedUsersTasks.concat(selectedUsersSubtasks)

    return filteredTicketObjectArray
}