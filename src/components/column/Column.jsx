/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Grid, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { boardPageStyles } from '../../styles/styles'
import TicketList from './TicketList'
import DropdownColumn from './DropdownColumn'
import AddTaskDialog from '../task/AddTaskDialog'
import RenameColumn from './RenameColumn'

const Column = ({ column, index }) => {
    const classes = boardPageStyles()
    const {
        tasks, ticketOrder, subtasks, board,
    } = column
    const [dialogStatus, setDialogStatus] = useState(false)
    const toggleDialog = () => setDialogStatus(!dialogStatus)

    return (
        <Draggable draggableId={column.id} index={index}>
            {(provided) => (
                <Grid
                    item
                    container
                    direction="column"
                    classes={{ root: classes.column }}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    spacing={2}
                >
                    <Grid classes={{ root: classes.columnHeader }} item container direction="row" justify="space-between" {...provided.dragHandleProps}>
                        <Grid item>
                            <RenameColumn editId={column.id} column={column} />
                        </Grid>
                        <Grid item container direction="row" alignItems="center" justify="flex-end" classes={{ root: classes.columnButtonGrid }}>
                            <Grid item>
                                <Button classes={{ root: classes.columnButton }}>
                                    <AddIcon classes={{ root: classes.columnButtonIcons }} onClick={toggleDialog} />
                                </Button>
                            </Grid>
                            <Grid item>
                                <DropdownColumn column={column} boardId={column.board.id} />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Droppable droppableId={column.id} type="task">
                        {(provided) => (
                            <Grid
                                item
                                container
                                classes={{ root: classes.ticketList }}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                <TicketList
                                    tasks={tasks}
                                    subtasks={subtasks}
                                    ticketOrder={ticketOrder}
                                    column={column}
                                    boardId={board.id}
                                />
                                {provided.placeholder}
                            </Grid>
                        )}
                    </Droppable>
                    <Grid item>
                        <AddTaskDialog
                            dialogStatus={dialogStatus}
                            toggleDialog={toggleDialog}
                            column={column}
                            boardId={board.id}
                        />
                    </Grid>
                </Grid>
            )}
        </Draggable>
    )
}
export default Column
