import React, { useState } from 'react'
import {
    Menu, MenuItem, Button, ListItemIcon, ListItemText, Grid, IconButton,
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import {
    Delete, Archive, Add,
} from '@material-ui/icons'
import { useApolloClient } from '@apollo/client'
import AlertBox from '../utils/AlertBox'
import AddSubtaskDialog from '../subtask/AddSubtaskDialog'
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
    const classes = boardPageStyles()
    const client = useApolloClient()
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
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                getContentAnchorEl={null}
                elevation={0}
            >
                <MenuItem onClick={(e) => toggleAddDialog(e)}>
                    <ListItemIcon>
                        <Add />
                    </ListItemIcon>
                    <ListItemText primary="Create subtask" />
                </MenuItem>
                <MenuItem onClick={() => openAlertDialog('ARCHIVE_TASK')}>
                    <ListItemIcon>
                        <Archive />
                    </ListItemIcon>
                    <ListItemText primary="Archive" />
                </MenuItem>
                <MenuItem onClick={() => openAlertDialog('DELETE_TASK')}>
                    <ListItemIcon>
                        <Delete />
                    </ListItemIcon>
                    <ListItemText primary="Remove" />
                </MenuItem>
            </Menu>
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
