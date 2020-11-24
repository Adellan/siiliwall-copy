import React, { useState } from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, TextField, Button,
} from '@material-ui/core'
import useAddBoard from '../../graphql/board/hooks/useAddBoard'

const NewBoardForm = ({ setOpen, open, projectId }) => {
    const [addBoard] = useAddBoard(projectId)
    const [name, setName] = useState('')
    const [prettyId, setPrettyId] = useState('')
    const [valid, setValid] = useState(true)
    const eventId = window.localStorage.getItem('eventId')
    const colors = [0, 1]
    const randomizedColor = colors[Math.floor(Math.random() * colors.length)]

    const handleChangeName = (event) => {
        setName(event.target.value)
    }

    const handleChangePrettyId = (event) => {
        setPrettyId(event.target.value)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const closeDialog = () => {
        setName('')
        setPrettyId('')
        setOpen(false)
    }

    const hasLowerCase = (prettyId) => {
        return (/[a-z]/.test(prettyId))
    }

    const validationOfPrettyId = () => {
        if (prettyId.length < 2 || prettyId.length > 5 || hasLowerCase(prettyId)) return false
        return true
    }

    const handleSave = () => {
        if (!validationOfPrettyId()) {
            setValid(false)
            return
        }
        else {
            addBoard({
                variables: {
                    name,
                    prettyId,
                    eventId,
                    projectId,
                    color: randomizedColor
                },
            })
            closeDialog()
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">New board</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the credentials for the board.
                    </DialogContentText>
                    <TextField
                        required
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        onChange={(event) => handleChangeName(event)}
                        data-cy="nameInput"
                    />
                    {valid ?
                        <TextField
                            required
                            margin="dense"
                            name="shortForm"
                            label="Short Form"
                            type="text"
                            fullWidth
                            data-cy="shortForm"
                            onChange={(event) => handleChangePrettyId(event)}
                            id="inputShortForm"
                            helperText="Has to be 2-5 characters long and letters must be capitalized"
                        />
                        : <TextField
                            error
                            margin="dense"
                            name="shortFormError"
                            defaultValue={prettyId}
                            type="text"
                            fullWidth
                            onChange={(event) => handleChangePrettyId(event)}
                            id="inputShortFormError"
                            helperText="Has to be 2-5 characters long and letters must be capitalized"
                        />
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button disabled={!name.length || !prettyId.length} onClick={handleSave} color="primary" data-cy="addNewBoard">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default NewBoardForm
