/* eslint-disable array-callback-return */
/* eslint-disable max-len */
import React, { useState, useCallback } from 'react'
import { Grid, Button } from '@material-ui/core'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { useApolloClient } from '@apollo/client'
import SwimlaneViewHeader from './SwimlaneViewHeader'
import SwimlaneList from './SwimlaneList'
import { onDragEndSwimlane } from '../../utils/onDragEndSwimlane'
import useMoveTicketInColumn from '../../graphql/ticket/hooks/useMoveTicketInColumn'
import useMoveTicketFromColumn from '../../graphql/ticket/hooks/useMoveTicketFromColumn'
import useMoveSwimlane from '../../graphql/task/hooks/useMoveSwimlane'
import AddTaskDialog from '../task/AddTaskDialog'
import { useSnackbarContext } from '../../contexts/SnackbarContext'
import { swimlaneStyles } from '../../styles/styles'

const SwimlaneView = ({ board }) => {
    // Modifying data's form to match the needs of swimlane components
    // Basically we want to each task to contain its subtasks
    // and have them divided by columns they exist at
    // These units are called swimlaneColumns
    const [moveTicketInColumn] = useMoveTicketInColumn()
    const [moveTicketFromColumn] = useMoveTicketFromColumn()
    const [moveSwimlane] = useMoveSwimlane()
    const [showAll, setShowAll] = useState(null)
    const [dialogStatus, setDialogStatus] = useState(false)
    const toggleDialog = () => setDialogStatus(!dialogStatus)
    const client = useApolloClient()
    const { setSnackbarMessage } = useSnackbarContext()
    const classes = swimlaneStyles()
    const { columns, swimlaneOrder } = board
    let tasks = []
    let subtasks = []

    columns.forEach((column) => {
        tasks = tasks.concat(column.tasks)
    })
    columns.forEach((column) => {
        subtasks = subtasks.concat(column.subtasks)
    })
    const tasksInCorrectOrder = swimlaneOrder.map((id) => tasks.find((task) => task.id === id)).filter((task) => task)
    const columnsInOrder = board.columnOrder.map((id) => columns.find((column) => column.id === id))

    const columnsForSwimlaneViewHeader = columnsInOrder.map((column) => ({ id: column.id, name: column.name, tasks: column.tasks }))
    // This object is passed to swimlaneList
    const tasksInOrder = tasksInCorrectOrder.map((task) => {
        const swimlaneColumns = columnsInOrder.map((column) => {
            // figure out task's subtasks in certain column
            const subtasksOfTaskInColumn = subtasks.filter((subtask) => {
                if (subtask.task.id === task.id && subtask.column.id === column.id) {
                    return subtask
                }
            })
            // Figure out the subtask order of task's subtasks in certain column
            // Loop through the ticketOrder of the column and pick up the ticketOrder objects
            // belonging to the subtasks of the task
            const subtaskOrder = column.ticketOrder.filter((obj) => subtasksOfTaskInColumn.map((subtask) => subtask.id).includes(obj.ticketId))
            const subtasksInOrder = subtaskOrder.map((obj) => subtasksOfTaskInColumn.find((subtask) => subtask.id === obj.ticketId))
            // Add the real order index for subtask
            const subtasksInColumnFinal = subtasksInOrder.map((subtask) => {
                const realOrderIndex = column.ticketOrder.findIndex((obj) => obj.ticketId === subtask.id)
                return { ...subtask, index: realOrderIndex }
            })

            return {
                name: column.name, id: column.id, subtasks: subtasksInColumnFinal,
            }
        })
        return { ...task, swimlaneColumns }
    })

    const handleShowClick = useCallback(() => {
        setShowAll(true)
    }, [setShowAll])

    const handleHideClick = useCallback(() => {
        setShowAll(false)
    }, [setShowAll])

    return (
        <DragDropContext onDragEnd={(result) => onDragEndSwimlane(result, moveTicketInColumn, moveTicketFromColumn, moveSwimlane, columns, client, tasksInOrder, board.id, setSnackbarMessage)}>
            <Grid container direction="column" classes={{ root: classes.swimlaneView }}>
                <Grid item container direction="column" classes={{ root: classes.swimlaneStickyGrid }}>
                    <Grid item container direction="row" alignItems="center" classes={{ root: classes.swimlaneViewButtonGrid }}>
                        <Grid item classes={{ root: classes.swimlaneAddButtonGrid }}>
                            <Button onClick={() => toggleDialog()} disabled={columns.length === 0} classes={{ root: classes.swimlaneAddTaskButton }}>Add task</Button>
                        </Grid>
                        <Grid item container direction="row" justify="flex-end" classes={{ root: classes.toggleSwimlaneButtonGrid }}>
                            <Grid item>
                                <Button onClick={() => handleHideClick()} disabled={tasks.length === 0} classes={{ root: classes.swimlaneHideButton }}>Hide all swimlanes</Button>
                            </Grid>
                            <Grid item>
                                <Button onClick={() => handleShowClick()} disabled={tasks.length === 0} classes={{ root: classes.swimlaneShowButton }} data-cy="switchLabel">Expand all swimlanes</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item classes={{ root: classes.swimlaneViewHeaderGrid }}>
                        <SwimlaneViewHeader columns={columnsForSwimlaneViewHeader} />
                    </Grid>
                </Grid>
                <Droppable droppableId={board.id} direction="vertical" type="swimlane">
                    {(provided) => (
                        <Grid item {...provided.droppableProps} ref={provided.innerRef} classes={{ root: classes.swimlaneListGrid }}>
                            <SwimlaneList tasksInOrder={tasksInOrder} showAll={showAll} boardId={board.id} />
                            {provided.placeholder}
                        </Grid>
                    )}
                </Droppable>
            </Grid>
            <AddTaskDialog
                dialogStatus={dialogStatus}
                toggleDialog={toggleDialog}
                column={columnsInOrder[0]}
                boardId={board.id}
            />
        </DragDropContext>
    )
}
export default SwimlaneView
