import React, { useState } from 'react'
import {
    Dialog, Grid, Button, TextField, DialogContent, DialogActions, DialogTitle,
} from '@material-ui/core'
import Select from 'react-select'
import {
    sizeSchema, titleSchema, descriptionSchema, taskSchema,
} from './validationSchema'
import { boardPageStyles } from '../../styles/styles'
import '../../styles.css'
import useAddTask from '../../graphql/task/hooks/useAddTask'
import useAllUsers from '../../graphql/user/hooks/useAllUsers'
import { useSnackbarContext } from '../../contexts/SnackbarContext'
import useAllColors from '../../graphql/task/hooks/useAllColors'

const AddTaskDialog = ({
    dialogStatus, column, toggleDialog, boardId,
}) => {
    const userQuery = useAllUsers()
    const colorQuery = useAllColors()
    const [addTask] = useAddTask(column?.id)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState(null)
    const [size, setSize] = useState(null)
    const [owner, setOwner] = useState(null)
    const classes = boardPageStyles()
    const [members, setMembers] = useState([])
    const [colors, setColors] = useState([])
    const [sizeError, setSizeError] = useState('')
    const [titleError, setTitleError] = useState('')
    const [descriptionError, setDescriptionError] = useState('')
    const { setSnackbarMessage } = useSnackbarContext()

    if (userQuery.loading || colorQuery.loading) return null

    const handleTitleChange = (event) => {
        const input = event.target.value
        titleSchema.validate(input).catch((err) => {
            setTitleError(err.message)
        })
        setTitleError('')
        setTitle(input)
    }

    const handleSizeChange = (event) => {
        const input = parseInt(event.target.value, 10)
        if (input === '') {
            setSize(null)
            return
        }
        sizeSchema.validate(input).catch((err) => {
            setSizeError(err.message)
        })
        setSize(input)
        setSizeError('')
    }

    const handleOwnerChange = (action) => {
        setOwner(action.value)
    }

    const handleMembersChange = (event) => {
        setMembers(Array.isArray(event) ? event.map((user) => user.value) : [])
    }

    const handleColorsChange = (event) => {
        setColors(Array.isArray(event) ? event.map((color) => color.value) : [])
    }

    const handleDescriptionChange = (event) => {
        const input = event.target.value
        if (input === '') {
            setDescription(null)
            return
        }

        descriptionSchema.validate(input).catch((err) => {
            setSizeError(err.message)
        })
        setDescriptionError('')
        setDescription(input)
    }

    const emptyState = () => {
        setTitle('')
        setSize(null)
        setOwner(null)
        setMembers([])
        setColors([])
        setDescription(null)
    }

    const handleSave = async (event) => {
        event.preventDefault()
        const eventId = window.localStorage.getItem('eventId')
        const isValid = await taskSchema.isValid({ title, size, description })
        if (isValid) {
            addTask({
                variables: {
                    boardId,
                    columnId: column.id,
                    title,
                    size,
                    ownerId: owner,
                    memberIds: members,
                    colorIds: colors,
                    description,
                    eventId,
                },
            })
            emptyState()
            toggleDialog()
        }
        setSnackbarMessage('New task created')
    }

    const handleCancel = () => {
        emptyState()
        toggleDialog()
    }

    const modifiedUserData = userQuery.data.allUsers.map((user) => {
        const newObject = { value: user.id, label: user.userName }
        return newObject
    })

    const modifiedColorData = colorQuery.data.allColors.map((color) => {
        const newObject = { value: color.id, label: color.color.charAt(0).toUpperCase() + color.color.slice(1) }
        return newObject
    })

    const isDisabled = () => {
        if (!title.length
            || sizeError.length > 0
            || titleError.length > 0
            || descriptionError.length > 0) {
            return true
        }
        return false
    }

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
                        error={titleError.length > 0}
                        id="filled-error-helper-text, inputTaskName"
                        autoComplete="off"
                        autoFocus={true}
                        required={true}
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        value={title}
                        fullWidth
                        helperText={titleError}
                        onChange={handleTitleChange}
                    />
                    <TextField
                        error={sizeError.length > 0}
                        id="filled-error-helper-text"
                        autoComplete="off"
                        margin="dense"
                        name="size"
                        label="Size"
                        type="number"
                        value={size || ''}
                        fullWidth
                        helperText={sizeError}
                        onChange={handleSizeChange}
                    />
                    <Select
                        isMulti
                        className="selectField"
                        placeholder="Select colors"
                        options={modifiedColorData}
                        onChange={handleColorsChange}
                        closeMenuOnSelect={false}
                    />
                    <Select
                        className="selectField"
                        placeholder="Select owner"
                        options={modifiedUserData}
                        onChange={handleOwnerChange}
                        id="taskSelectOwner"
                    />
                    <Select
                        isMulti
                        className="selectField"
                        placeholder="Select members"
                        options={modifiedUserData}
                        onChange={handleMembersChange}
                        closeMenuOnSelect={false}
                    />
                    <TextField
                        error={descriptionError.length > 0}
                        id="standard-multiline-static, filled-error-helper-text"
                        autoComplete="off"
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        helperText={descriptionError}
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
                        disabled={isDisabled()}
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
