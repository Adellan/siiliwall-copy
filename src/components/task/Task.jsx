/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { Grid, Divider } from '@material-ui/core'
import { Draggable } from 'react-beautiful-dnd'
import propsAreEqual from '../../utils/propsAreEqual'
import { boardPageStyles } from '../../styles/styles'
import DropdownTask from './DropdownTask'
import TaskEditDialog from './EditTaskDialog'
import ColorPill from '../utils/ColorPill'
import MemberCircle from '../utils/MemberCircle'
import { add3Dots } from '../../utils/add3Dots'

const Task = ({
    task, index, columnId, columnName, boardId,
}) => {
    const classes = boardPageStyles()
    const { title, members, owner, prettyId } = task
    const titleLimit = 25
    let tasksOwnerAndMembers
    if (owner) {
        tasksOwnerAndMembers = members.concat(owner)
    } else {
        tasksOwnerAndMembers = members
    }

    const [dialogStatus, setDialogStatus] = useState(false)

    const toggleDialog = () => setDialogStatus(!dialogStatus)

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
                    id="clickableTask"
                >
                    <Grid
                        item
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                        classes={{ root: classes.taskHeader }}
                    >
                        <Grid item classes={{ root: classes.taskTitle }}>
                            <p>{prettyId}</p>
                        </Grid>
                        <Grid item onClick={handleDialogClick}>
                            <DropdownTask
                                task={task}
                                columnId={columnId}
                                columnName={columnName}
                                boardId={boardId}
                            />
                        </Grid>
                    </Grid>
                    <Grid item direction="column" container spacing={1}>
                        <Grid item classes={{ root: classes.taskName }}>
                            <p>{add3Dots(title, titleLimit)}</p>
                        </Grid>
                        <Grid item container direction="row" spacing={1} classes={{ root: classes.ticketColorPillsGrid }}>
                            {task.colors ? (
                                task.colors.map((colorObj) => (
                                    <Grid item key={colorObj.id}><ColorPill color={colorObj.color} /></Grid>
                                ))
                            ) : null}
                        </Grid>
                    </Grid>
                    <Grid item>
                        {tasksOwnerAndMembers.length ? (
                            <Divider classes={{ root: classes.ticketDivider }} />
                        ) : null}
                    </Grid>
                    <Grid item container direction="row" justify="flex-end">
                        {tasksOwnerAndMembers.length ? (
                            tasksOwnerAndMembers.map((personObj) => (
                                <Grid item key={personObj.id}><MemberCircle name={personObj.userName} /></Grid>
                            ))
                        ) : null}
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

export default React.memo(Task, propsAreEqual)
