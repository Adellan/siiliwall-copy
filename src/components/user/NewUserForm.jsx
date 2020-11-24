import React, { useState } from 'react'
import {
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, TextField, Button,
} from '@material-ui/core'
import useAddUser from '../../graphql/user/hooks/useAddUser'

const NewUserForm = ({ setOpen, open }) => {
    const [addUser] = useAddUser()
    const [name, setName] = useState('')
    const handleChange = (event) => {
        setName(event.target.value)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSave = () => {
        addUser({
            variables: {
                userName: name,
            },
        })
        setName('')
        setOpen(false)
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">New user</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the credentials for the user.
                    </DialogContentText>
                    <TextField
                        autoComplete="off"
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        onChange={(event) => handleChange(event)}
                        data-cy="nameOfUser"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" data-cy="cancel">
                        Cancel
                    </Button>
                    <Button disabled={!name.length} onClick={handleSave} color="primary" data-cy="addUserToDb">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
export default NewUserForm
