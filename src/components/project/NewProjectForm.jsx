import React, { useState } from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, TextField, Button,
} from '@material-ui/core'
import useAddProject from '../../graphql/project/hooks/useAddProject'

const NewProjectForm = ({ open, setOpen }) => {
    const [addProject] = useAddProject()
    const [name, setName] = useState('')

    const handleChangeName = (event) => {
        setName(event.target.value)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const closeDialog = () => {
        setName('')
        setOpen(false)
    }
    const handleSave = () => {
        addProject({
            variables: {
                name,
            },
        })
        closeDialog()

    }
    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">New Project</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the name for the project.
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
                        data-cy="inputName"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" data-cy="cancel">
                        Cancel
                    </Button>
                    <Button disabled={!name.length} onClick={handleSave} color="primary" data-cy="addProject">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default NewProjectForm