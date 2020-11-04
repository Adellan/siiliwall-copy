/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
import { Draggable } from 'react-beautiful-dnd'
import { boardPageStyles } from '../../styles/styles'
import DropdownTask from './DropdownTask'
import TaskEditDialog from './EditTaskDialog'

const Task = ({
    task, index, columnId, boardId,
}) => {
    const classes = boardPageStyles()
    const { title, members, prettyId } = task
    const titleLimit = 25
    const descrLimit = 20
    const [dialogStatus, setDialogStatus] = useState(false)
    const toggleDialog = () => setDialogStatus(!dialogStatus)
    const dots = '...'
    const add3Dots = () => {
        let checkedTitle = title
        if (title.length > titleLimit) {
            checkedTitle = title.substring(0, titleLimit) + dots
        }
        return checkedTitle
    }
    const descrDots = (description) => {
        let retVal = description
        if (description.length > descrLimit) {
            retVal = description.substring(0, descrLimit) + dots
        }
        return retVal
    }

    // Opens task editing dialog
    const handleClick = () => {
        toggleDialog()
    }

    // Prevents edit task dialog from opening, when user presses the three dots to open dropdown
    const handleDialogClick = (e) => e.stopPropagation()

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <Grid
                    item
                    container
                    direction="column"
                    classes={{ root: classes.task }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    spacing={1}
                    onClick={handleClick}
                >
                    <Grid
                        item
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="flex-start"
                        classes={{ root: classes.taskInner }}
                    >
                        <Grid item>
                            <h3>{prettyId}</h3>
                        </Grid>
                        <Grid item onClick={handleDialogClick}>
                            <DropdownTask
                                task={task}
                                columnId={columnId}
                                boardId={boardId}
                            />
                        </Grid>
                    </Grid>
                    <Grid item direction="column" container>
                        <Grid item>
                            <p>{add3Dots(task.title)}</p>
                        </Grid>
                        <Grid item>
                            {task.owner ? (
                                <p>
                                    owner:&nbsp;
                                    {task.owner.userName}
                                </p>
                            ) : null}
                        </Grid>
                        <Grid item>
                            {task.size ? (
                                <p>
                                    size:&nbsp;
                                    {task.size}
                                </p>
                            ) : null}
                        </Grid>
                        <Grid item>
                            {task.members.length !== 0 ? (
                                // this part renders commas after name only if formatting is like below
                                <p>
                                    {`members:  ${members.map((user) => ` ${user.userName}`)}`}
                                </p>
                            ) : null}
                        </Grid>
                        <Grid item>
                            {task.description ? (
                                <p>
                                    description:&nbsp;
                                    {descrDots(task.description)}
                                </p>
                            ) : null}
                        </Grid>
                    </Grid>

                    <TaskEditDialog
                        dialogStatus={dialogStatus}
                        toggleDialog={toggleDialog}
                        editId={task.id}
                        task={task}
                    />
                </Grid>

            )}
        </Draggable>
    )
}
export default Task
