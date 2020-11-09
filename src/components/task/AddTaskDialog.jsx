/* eslint-disable object-curly-newline */
import React, { useState } from 'react'
import { Dialog, Grid, Button, TextField, DialogContent, DialogActions, DialogTitle } from '@material-ui/core'
import Select from 'react-select'
import { boardPageStyles } from '../../styles/styles'
import '../../styles.css'
import useAddTask from '../../graphql/task/hooks/useAddTask'
import useAllUsers from '../../graphql/user/hooks/useAllUsers'

const AddTaskDialog = ({ dialogStatus, column, toggleDialog, boardId }) => {
    const { loading, data } = useAllUsers()
    const [addTask] = useAddTask(column?.id)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState(null)
    const [size, setSize] = useState(null)
    const [owner, setOwner] = useState(null)
    const classes = boardPageStyles()
    const [members, setMembers] = useState([])

    if (loading) return null

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }
    const handleDescriptionChange = (event) => {
        if (event.target.value === '') {
            setDescription(null)
            return
        }
        setDescription(event.target.value)
    }

    const handleOwnerChange = (action) => {
        setOwner(action.value)
    }

    const handleSizeChange = (event) => {
        if (event.target.value === '') {
            setSize(null)
            return
        }
        setSize(parseFloat(event.target.value))
    }
    const handleMembersChange = (event) => {
        setMembers(Array.isArray(event) ? event.map((user) => user.value) : [])
    }

    const emptyState = () => {
        setTitle('')
        setSize(null)
        setOwner(null)
        setMembers([])
        setDescription(null)
    }

    const handleSave = (event) => {
        event.preventDefault()

        addTask({
            variables: {
                boardId,
                columnId: column.id,
                title,
                size,
                ownerId: owner,
                memberIds: members,
                description,
            },
        })
        emptyState()
        toggleDialog()
    }

    const handleCancel = () => {
        emptyState()
        toggleDialog()
    }

    const modifiedData = data.allUsers.map((user) => {
        const newObject = { value: user.id, label: user.userName }
        return newObject
    })

    return (
        <Grid>
            <Dialog
                fullWidth
                maxWidth="md"
                onClose={toggleDialog}
                open={dialogStatus}
                aria-labelledby="max-width-dialog-title"
                classes={{ paper: classes.dialogPaper }}
            >
                <DialogTitle aria-labelledby="max-width-dialog-title">Create new task</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        autoComplete="off"
                        margin="dense"
                        name="title"
                        label="Name"
                        type="text"
                        value={title}
                        fullWidth
                        onChange={handleTitleChange}
                        id="inputTaskName"
                    />
                    <TextField
                        autoComplete="off"
                        margin="dense"
                        name="size"
                        label="Size"
                        type="number"
                        value={size || ''}
                        fullWidth
                        onChange={handleSizeChange}
                    />
                    <Select
                        className="selectField"
                        placeholder="Select owner"
                        options={modifiedData}
                        onChange={handleOwnerChange}
                        id="taskSelectOwner"
                    />
                    <Select
                        isMulti
                        className="selectField"
                        placeholder="Select members"
                        options={modifiedData}
                        onChange={handleMembersChange}
                        closeMenuOnSelect={false}
                    />
                    <TextField
                        id="standard-multiline-static"
                        autoComplete="off"
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        multiline
                        rows={3}
                        value={description || ''}
                        fullWidth
                        onChange={handleDescriptionChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCancel}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!title.length}
                        onClick={handleSave}
                        color="primary"
                        id="createTaskButton"
                    >
                        Create task
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
export default AddTaskDialog
