/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
import React from 'react'
import { Grid } from '@material-ui/core'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { useApolloClient } from '@apollo/client'
import ColumnList from '../column/ColumnList'
import useMoveTicketInColumn from '../../graphql/ticket/hooks/useMoveTicketInColumn'
import useMoveTicketFromColumn from '../../graphql/ticket/hooks/useMoveTicketFromColumn'
import useMoveColumn from '../../graphql/column/hooks/useMoveColumn'
import { onDragEnd } from '../../utils/onDragEnd'
import { boardPageStyles } from '../../styles/styles'
import '../../styles.css'
import { useSnackbarContext } from '../../contexts/SnackbarContext'

const Board = ({ board, selectedUser }) => {
    const [moveTicketInColumn] = useMoveTicketInColumn()
    const [moveTicketFromColumn] = useMoveTicketFromColumn()
    const [moveColumn] = useMoveColumn()
    const classes = boardPageStyles()
    const client = useApolloClient()
    const { setSnackbarMessage } = useSnackbarContext()

    const { columnOrder, columns } = board
    const allTicketsInBoard = columns.map(column => column.tasks.concat(column.subtasks)).flat()
    const columnsInOrder = columnOrder.map(id => columns.find((column) => column.id === id))
    const ticketOrderObjectsIdsInOrder = columnsInOrder.map(column => column.ticketOrder.map(ticketOrdObj => ticketOrdObj)).flat()
    const ticketsInOrder = ticketOrderObjectsIdsInOrder.map(ticketOrdObj => allTicketsInBoard.find(ticket => ticket.id === ticketOrdObj.ticketId))

    const ticketsInOrderFinal = columnsInOrder.map(column => {
        const ticketsInColumn = ticketsInOrder.map(ticket => {
            const realOrderIndex = column.ticketOrder.findIndex(obj => obj.ticketId === ticket.id)
            return { ...ticket, index: realOrderIndex }
        })
        return {
            name: column.name, id: column.id, tickets: ticketsInColumn
        }
    })


    return (
        <Grid container classes={{ root: classes.board }}>
            <DragDropContext onDragEnd={(result) => onDragEnd(
                result, moveTicketInColumn, moveTicketFromColumn, moveColumn, client, columns, board, setSnackbarMessage, selectedUser, ticketsInOrderFinal
            )}
            >

                <Droppable droppableId={board.id} direction="horizontal" type="column">
                    {(provided) => (
                        <Grid
                            item
                            container
                            direction="row"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            spacing={2}
                        >
                            <Grid item><ColumnList columns={columns} columnOrder={columnOrder} boardId={board.id} selectedUser={selectedUser} /></Grid>
                            {provided.placeholder}

                        </Grid>
                    )}
                </Droppable>

            </DragDropContext>
        </Grid>
    )
}
export default Board
