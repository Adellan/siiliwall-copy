import React from 'react'
import { Grid } from '@material-ui/core'
import Task from '../task/Task'
import Subtask from '../subtask/Subtask'

const TicketList = ({
    ticketOrder, tasks, subtasks, column, boardId, selectedUser
}) => {
    let selectedUsersSubtasks,
        selectedUsersTasks,
        filteredUserIsOwner,
        filteredUserIsMember,
        filteredTicketOrderArray,
        filteredTicketObjectArray
    if (subtasks.length) {
        selectedUsersSubtasks = subtasks.filter(subtask => {
            filteredUserIsMember = subtask.members.some(member => member.userName === selectedUser)
            if (subtask.owner) {
                filteredUserIsOwner = subtask.owner.userName === selectedUser ? true : false
            }
            if (filteredUserIsMember || filteredUserIsOwner) {
                return subtask
            }
        })
    }
    if (tasks.length) {
        selectedUsersTasks = column.tasks.filter(task => {
            filteredUserIsMember = task.members.some(member => member.userName === selectedUser)
            if (task.owner) {
                filteredUserIsOwner = task.owner.userName === selectedUser ? true : false
            }
            if (filteredUserIsMember || filteredUserIsOwner) {
                return task
            }
        })
    }
    if (selectedUser) {
        filteredTicketOrderArray = ticketOrder.filter((obj) => {
            let foundTicket
            if (obj.type === 'task' && selectedUsersTasks && selectedUsersTasks.length) {
                foundTicket = selectedUsersTasks.find(task => task.id === obj.ticketId)
            } else if (obj.type === 'subtask' && selectedUsersSubtasks && selectedUsersSubtasks.length) {
                foundTicket = selectedUsersSubtasks.find(subtask => subtask.id === obj.ticketId)
            }
            return foundTicket
        })
        const filteredTaskObjectArray = tasks.filter(task => filteredTicketOrderArray.find(ticketOrdObj => ticketOrdObj.ticketId === task.id))
        const filteredSubtaskObjectArray = subtasks.filter(subtask => filteredTicketOrderArray.find(ticketOrdObj => ticketOrdObj.ticketId === subtask.id))
        filteredTicketObjectArray = filteredTaskObjectArray.concat(filteredSubtaskObjectArray)
    }

    const ticketsInOrder = ticketOrder.map((obj) => {
        let foundTicket
        if (obj.type === 'task') {
            foundTicket = tasks.find((task) => task.id === obj.ticketId)
            foundTicket = { ...foundTicket, type: 'task' }
        } else if (obj.type === 'subtask') {
            foundTicket = subtasks.find((subtask) => subtask.id === obj.ticketId)
            foundTicket = { ...foundTicket, type: 'subtask' }
        }
        return foundTicket
    })

    return (
        <Grid container direction="column" alignItems="center">
            {
                filteredTicketObjectArray ?
                    filteredTicketObjectArray.map((ticket, index) => {
                        let component
                        console.log('ticket', ticket)
                        if (ticket.__typename === 'Task') {
                            component = (
                                <Grid item key={ticket.id}>
                                    <Task index={index} task={ticket} column={column} boardId={boardId} />
                                </Grid>
                            )
                        } else if (ticket.__typename === 'Subtask') {
                            component = (
                                <Grid item key={ticket.id}>
                                    <Subtask key={ticket.id} index={index} subtask={ticket} column={column} boardId={boardId} />
                                </Grid>
                            )
                        }

                        return component
                    })
                    :
                    ticketsInOrder.map((ticket, index) => {
                        let component
                        if (ticket.type === 'task') {
                            component = (
                                <Grid item key={ticket.id}>
                                    <Task index={index} task={ticket} column={column} boardId={boardId} />
                                </Grid>
                            )
                        } else if (ticket.type === 'subtask') {
                            component = (
                                <Grid item key={ticket.id}>
                                    <Subtask key={ticket.id} index={index} subtask={ticket} column={column} boardId={boardId} />
                                </Grid>
                            )
                        }

                        return component
                    })
            }
        </Grid>
    )
}

export default React.memo(TicketList)
