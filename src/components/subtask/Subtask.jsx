/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { Grid, Divider } from '@material-ui/core'
import { Draggable } from 'react-beautiful-dnd'
import DropDownSubtask from './DropdownSubtask'
import { boardPageStyles } from '../../styles/styles'
import EditSubtaskDialog from './EditSubtaskDialog'
import ColorPill from '../ColorPill'
import MemberCircle from '../MemberCircle'

const Subtask = ({ subtask, index, columnId }) => {
    const classes = boardPageStyles()
    const { name, members, owner } = subtask
    const nameLimit = 25
    const dots = '...'
    const [dialogStatus, setDialogStatus] = useState(false)

    let subtasksOwnerAndMembers
    if (owner) {
        subtasksOwnerAndMembers = members.concat(owner)
    } else {
        subtasksOwnerAndMembers = members
    }

    const toggleDialog = () => setDialogStatus(!dialogStatus)

    const handleClick = () => {
        toggleDialog()
    }

    const handleDialogClick = (e) => e.stopPropagation()

    const add3Dots = () => {
        let checkedName = name
        if (name.length > nameLimit) {
            checkedName = name.substring(0, nameLimit) + dots
        }
        return checkedName
    }

    return (
        <Draggable draggableId={subtask.id} index={index}>
            {(provided) => (
                <Grid
                    item
                    container
                    direction="column"
                    classes={{ root: classes.subtaskComponent }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    spacing={1}
                    onClick={handleClick}
                >
                    <Grid
                        item
                        container
                        classes={{ root: classes.subtaskHeader }}
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Grid item classes={{ root: classes.subtaskTaskPrettyId }}>
                            <p>{subtask.task.prettyId}</p>
                        </Grid>
                        <Grid item classes={{ root: classes.subtaskDropdownGrid }} onClick={handleDialogClick}>
                            <DropDownSubtask
                                subtaskId={subtask.id}
                                columnId={columnId}
                            />
                        </Grid>
                    </Grid>
                    <Grid item container direction="column" spacing={1}>
                        <Grid item classes={{ root: classes.subtaskPrettyId }}>
                            <p>{subtask.prettyId}</p>
                        </Grid>
                        <Grid item classes={{ root: classes.subtaskName }}>
                            <p>{add3Dots(subtask.name)}</p>
                        </Grid>
                        <Grid item container direction="row" spacing={1} classes={{ root: classes.ticketColorPillsGrid }}>
                            {subtask.colors ? (
                                subtask.colors.map((colorObj) => (
                                    <Grid item key={colorObj.id}><ColorPill color={colorObj.color} /></Grid>
                                ))
                            ) : null}
                        </Grid>
                    </Grid>
                    <Grid item>
                        {subtasksOwnerAndMembers.length ? (
                            <Divider classes={{ root: classes.ticketDivider }} />
                        ) : null}
                    </Grid>
                    <Grid item container direction="row" justify="flex-end">
                        {subtasksOwnerAndMembers.length ? (
                            subtasksOwnerAndMembers.map((personObj, i) => (
                                <Grid item key={i}><MemberCircle name={personObj.userName} /></Grid>
                            ))
                        ) : null}
                    </Grid>
                    <EditSubtaskDialog
                        dialogStatus={dialogStatus}
                        toggleDialog={toggleDialog}
                        editId={subtask.id}
                        subtask={subtask}
                    />
                </Grid>
            )}
        </Draggable>
    )
}
export default Subtask
