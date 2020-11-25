import React, { useState } from 'react'
import {
    Menu, MenuItem, Button, ListItemText, ListItemIcon, Grid, IconButton, Divider,
} from '@material-ui/core'
import {
    Delete, Archive, Add, Edit,
} from '@material-ui/icons'

import MoreVertIcon from '@material-ui/icons/MoreVert'
import { useApolloClient } from '@apollo/client'
import AlertBox from '../utils/AlertBox'
import AddSubtaskDialog from '../subtask/AddSubtaskDialog'
import TaskEditDialog from './EditTaskDialog'
import { boardPageStyles } from '../../styles/styles'
import { COLUMNORDER_AND_COLUMNS } from '../../graphql/fragments'

const DropdownTask = ({
    column, task, boardId, calledFromSwimlane,
}) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [action, setAction] = useState(null)
    const [count, setCount] = useState(null)
    const [alertDialogStatus, setAlertDialogStatus] = useState(false)
    const [addDialogStatus, setAddDialogStatus] = useState(false)
    const [editDialogStatus, setEditDialogStatus] = useState(false)
    const classes = boardPageStyles()
    const client = useApolloClient()

    const toggleEditDialog = () => {
        setAnchorEl(null)
        setEditDialogStatus(!editDialogStatus)
    }

    const toggleAddDialog = (e) => {
        e.stopPropagation()
        setAnchorEl(null)
        setAddDialogStatus(!addDialogStatus)
    }
    const toggleAlertDialog = () => setAlertDialogStatus(!alertDialogStatus)

    const handleClick = (e) => {
        e.stopPropagation()
        setAnchorEl(e.currentTarget)
    }

    const openAlertDialog = (order) => {
        const boardIdForCache = `Board:${boardId}`
        const columnData = client.readFragment({
            id: boardIdForCache,
            fragment: COLUMNORDER_AND_COLUMNS,
        })
        const allSubtasks = columnData.columns.map((column) => column.subtasks).flat()
        const subtasksOfTask = allSubtasks.filter((subtask) => subtask.task.id === task.id)
        if (order === 'DELETE_TASK' && subtasksOfTask.length) {
            setCount(subtasksOfTask.length)
            setAction('DELETE_TASK_IF_SUBTASKS')
            setAlertDialogStatus(true)
            setAnchorEl(null)
            return
        }
        if (order === 'ARCHIVE_TASK' && subtasksOfTask.length) {
            setCount(subtasksOfTask.length)
            setAction('ARCHIVE_TASK_IF_SUBTASKS')
            setAlertDialogStatus(true)
            setAnchorEl(null)
            return
        }
        setAction(order)
        setAlertDialogStatus(true)
        setAnchorEl(null)
    }
    return (
        <Grid item container direction="row" justify="flex-end" alignItems="center">
            <Grid>
                {calledFromSwimlane
                    ? (
                        <IconButton
                            aria-owns={anchorEl ? 'simple-menu' : undefined}
                            aria-haspopup="true"
                            onClick={(e) => handleClick(e)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    )
                    : (
                        <Button
                            aria-owns={anchorEl ? 'simple-menu' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                            classes={{ root: classes.taskDropdownButton }}
                        >
                            <MoreVertIcon classes={{ root: classes.taskButtonIcons }} />
                        </Button>
                    )}
            </Grid>

            <Menu
                classes={{ paper: classes.taskDropdown }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                getContentAnchorEl={null}
                elevation={0}
            >
                <MenuItem onClick={() => toggleEditDialog()}>
                    <ListItemIcon>
                        <Edit />
                    </ListItemIcon>
                    <ListItemText primary="Edit task" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={(e) => toggleAddDialog(e)}>
                    <ListItemIcon>
                        <Add />
                    </ListItemIcon>
                    <ListItemText primary="Add subtask" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => openAlertDialog('ARCHIVE_TASK')}>
                    <ListItemIcon>
                        <Archive />
                    </ListItemIcon>
                    <ListItemText primary="Archive task" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => openAlertDialog('DELETE_TASK')}>
                    <ListItemIcon>
                        <Delete />
                    </ListItemIcon>
                    <ListItemText primary="Remove task" />
                </MenuItem>
            </Menu>
            <TaskEditDialog
                dialogStatus={editDialogStatus}
                toggleDialog={toggleEditDialog}
                editId={task.id}
                task={task}
            />
            <AlertBox
                alertDialogStatus={alertDialogStatus}
                toggleAlertDialog={toggleAlertDialog}
                task={task}
                column={column}
                boardId={boardId}
                action={action}
                count={count}
            />
            <AddSubtaskDialog
                addDialogStatus={addDialogStatus}
                toggleAddDialog={toggleAddDialog}
                column={column}
                taskId={task.id}
                boardId={boardId}
            />
        </Grid>
    )
}
export default DropdownTask
