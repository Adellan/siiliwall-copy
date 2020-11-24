/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { Grid } from '@material-ui/core'
import { Droppable } from 'react-beautiful-dnd'
import Divider from '@material-ui/core/Divider'
import { swimlaneStyles } from '../../styles/styles'
import Subtask from '../subtask/Subtask'

const SwimlaneColumn = ({
    swimlaneColumn, taskId, isTheLeftMost, mostSubtasks, boardId,
}) => {
    const { subtasks } = swimlaneColumn
    const classes = swimlaneStyles()
    const heightOfTheDivider = mostSubtasks > 1 ? mostSubtasks * 140 : 1 * 140

    const idForDroppable = `${swimlaneColumn.id}${taskId}`
    return (
        <Grid container direction="row">
            <Droppable droppableId={idForDroppable} type="subtask">
                {(provided) => (
                    <Grid
                        item
                        container
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        classes={{ root: classes.swimlaneColumn }}
                        direction="column"
                    >
                        {subtasks.map((subtask) => (
                            <Grid item key={subtask.id}>
                                <Subtask subtask={subtask} index={subtask.index} column={swimlaneColumn} boardId={boardId} />
                            </Grid>
                        ))}
                        {provided.placeholder}

                    </Grid>
                )}
            </Droppable>
            {!isTheLeftMost && (
                <Divider style={{ height: heightOfTheDivider }} orientation="vertical" />
            )}
        </Grid>

    )
}
export default SwimlaneColumn
