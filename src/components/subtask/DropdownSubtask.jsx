import React, { useState } from 'react'
import {
    Menu, MenuItem, Button, ListItemIcon, ListItemText, Grid, Divider,
} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { Delete, Archive } from '@material-ui/icons'
import { boardPageStyles } from '../../styles/styles'
import AlertBox from '../utils/AlertBox'

const DropdownSubtask = ({ subtask, column, boardId }) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const classes = boardPageStyles()
    const [alertDialogStatus, setAlertDialogStatus] = useState(false)
    const [action, setAction] = useState(null)

    const openAlertDialog = (order) => {
        setAction(order)
        setAlertDialogStatus(true)
        setAnchorEl(null)
    }

    const toggleAlertDialog = () => setAlertDialogStatus(!alertDialogStatus)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    return (
        <Grid item container direction="row" justify="flex-end" alignItems="center">
            <Button
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                classes={{ root: classes.subtaskDropdownButton }}
            >
                <MoreVertIcon classes={{ root: classes.subtaskButtonIcons }} />
            </Button>
            <Menu
                classes={{ paper: classes.subtaskDropdown }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                getContentAnchorEl={null}
                elevation={0}
            >
                <MenuItem onClick={() => openAlertDialog('ARCHIVE_SUBTASK')}>
                    <ListItemIcon>
                        <Archive />
                    </ListItemIcon>
                    <ListItemText primary="Archive" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => openAlertDialog('DELETE_SUBTASK')}>
                    <ListItemIcon>
                        <Delete />
                    </ListItemIcon>
                    <ListItemText primary="Remove" />
                </MenuItem>
            </Menu>
            <AlertBox
                alertDialogStatus={alertDialogStatus}
                toggleAlertDialog={toggleAlertDialog}
                action={action}
                subtask={subtask}
                column={column}
                boardId={boardId}
            />
        </Grid>
    )
}
export default DropdownSubtask
