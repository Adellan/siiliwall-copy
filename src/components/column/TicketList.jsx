import React from 'react'
import { Grid } from '@material-ui/core'
import Task from '../task/Task'
import Subtask from '../subtask/Subtask'

const TicketList = ({
    ticketOrder, tasks, subtasks, column, boardId,
}) => {
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
            {ticketsInOrder.map((ticket, index) => {
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
            })}
        </Grid>
    )
}

export default React.memo(TicketList)
