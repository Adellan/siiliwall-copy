import React, { useEffect, useState } from 'react'
import {
    Dialog, Grid, Button, TextField, DialogContent, DialogActions, DialogTitle,
} from '@material-ui/core'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import useEditTask from '../../graphql/task/hooks/useEditTask'
import {
    sizeSchema, titleSchema, descriptionSchema, taskSchema,
} from './validationSchema'
import { boardPageStyles } from '../../styles/styles'
import useAllUsers from '../../graphql/user/hooks/useAllUsers'
import { useSnackbarContext } from '../../contexts/SnackbarContext'
import useAllColors from '../../graphql/task/hooks/useAllColors'

const EditTaskDialog = ({
    dialogStatus, editId, toggleDialog, task,
}) => {
    const [editTask] = useEditTask()
    const userQuery = useAllUsers()
    const colorQuery = useAllColors()
    const [title, setTitle] = useState(task?.title)
    const [size, setSize] = useState(task?.size ? task.size : null)
    const [description, setDescription] = useState(task?.description)
    const [owner, setOwner] = useState(task?.owner ? task.owner.id : null)
    const [members, setMembers] = useState()
    const [colors, setColors] = useState()
    const [sizeError, setSizeError] = useState('')
    const [titleError, setTitleError] = useState('')
    const [descriptionError, setDescriptionError] = useState('')
    const arrayOfOldMemberIds = task?.members?.map((user) => user.id)
    const arrayOfOldColorIds = task?.colors?.map((color) => color.id)
    const animatedComponents = makeAnimated()
    const classes = boardPageStyles()
    const { setSnackbarMessage } = useSnackbarContext()

    useEffect(() => {
        setTitle(task.title)
        setSize(task.size)
        setOwner(task.owner ? task.owner.id : null)
        setMembers(task.members.length > 0 ? arrayOfOldMemberIds : [])
        setColors(task.colors.length > 0 ? arrayOfOldColorIds : [])
        setDescription(task.description)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task])

    if (userQuery.loading || colorQuery.loading) return null

    const handleTitleChange = (event) => {
        const input = event.target.value
        titleSchema.validate(input).catch((err) => {
            setTitleError(err.message)
        })
        setTitleError('')
        setTitle(input)
    }

    const handleOwnerChange = (action) => {
        setOwner(action != null ? action.value : null)
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

    const handleMembersChange = (event) => {
        setMembers(Array.isArray(event) ? event.map((user) => user.value) : [])
    }

    const handleColorsChange = (event) => {
        setColors(Array.isArray(event) ? event.map((color) => color.value) : [])
    }

    const handleSave = async (event) => {
        event.preventDefault()
        const eventId = window.localStorage.getItem('eventId')
        const isValid = await taskSchema.isValid({ title, size, description })
        if (isValid) {
            editTask({
                variables: {
                    taskId: editId,
                    title,
                    size,
                    ownerId: owner,
                    oldMemberIds: arrayOfOldMemberIds,
                    newMemberIds: members,
                    oldColorIds: arrayOfOldColorIds,
                    newColorIds: colors,
                    description,
                    eventId,
                },
            })
            toggleDialog()
        }
        setSnackbarMessage('Changes saved')
    }

    const recoverState = () => {
        setTitle(task?.title)
        setSize(task?.size ? task.size : null)
        setOwner(task?.owner ? task.owner.id : null)
        setMembers(task.members.length > 0 ? arrayOfOldMemberIds : [])
        setColors(task.colors.length > 0 ? arrayOfOldColorIds : [])
        setDescription(task?.description)
    }

    const handleCancel = () => {
        recoverState()
        toggleDialog()
    }

    // Prevents closing dialog when clicking on it to edit task's fields
    const handleDialogClick = (e) => e.stopPropagation()

    // Modifiying userData to be of form expected by the react select component
    const modifiedUserData = userQuery.data.allUsers.map((user) => {
        const newObject = { value: user.id, label: user.userName }
        return newObject
    })

    const chosenMembersData = task.members.map((user) => {
        const newObject = { value: user.id, label: user.userName }
        return newObject
    })

    const chosenColorsData = task.colors.map((color) => {
        const newObject = { value: color.id, label: color.color.charAt(0).toUpperCase() + color.color.slice(1) }
        return newObject
    })

    const modifiedColorData = colorQuery.data.allColors.map((color) => {
        const newObject = { value: color.id, label: color.color.charAt(0).toUpperCase() + color.color.slice(1) }
        return newObject
    })

    // data for showing only the members not yet chosen
    const modifiedMemberOptions = modifiedUserData
        .filter((user) => !arrayOfOldMemberIds.includes(user.id))

    const modifiedColorOptions = modifiedColorData
        .filter((color) => !arrayOfOldColorIds.includes(color.id))

    const chosenOwnerData = modifiedUserData.map((user) => {
        let newObject
        if (user.value === owner) {
            newObject = { value: user.value, label: user.label }
        }
        return newObject
    })

    return (
        <Grid>
            <Dialog
                fullWidth
                maxWidth="md"
                onClose={handleCancel}
                open={dialogStatus}
                aria-labelledby="max-width-dialog-title"
                classes={{ paper: classes.dialogPaper }}
                onClick={handleDialogClick}
            >
                <DialogTitle aria-labelledby="max-width-dialog-title">Edit task</DialogTitle>
                <DialogContent>
                    <TextField
                        error={titleError.length > 0}
                        id="filled-error-helper-text"
                        autoComplete="off"
                        autoFocus={true}
                        required={true}
                        margin="dense"
                        name="title"
                        label="Name"
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
                        className="selectField"
                        closeMenuOnSelect={false}
                        placeholder="Select colors"
                        options={modifiedColorOptions}
                        defaultValue={chosenColorsData}
                        components={animatedComponents}
                        isMulti
                        onChange={handleColorsChange}
                        id="taskSelectColor"
                    />
                    <Select
                        className="selectField"
                        isClearable
                        placeholder="Select owner"
                        options={modifiedUserData}
                        defaultValue={chosenOwnerData}
                        onChange={handleOwnerChange}
                        id="taskSelectOwner"
                    />
                    <Select
                        className="selectField"
                        closeMenuOnSelect={false}
                        placeholder="Select members"
                        options={modifiedMemberOptions}
                        defaultValue={chosenMembersData}
                        components={animatedComponents}
                        isMulti
                        onChange={handleMembersChange}
                        id="taskSelectMember"
                    />
                    <TextField
                        error={descriptionError.length > 0}
                        id="standard-multiline-static, filled-error-helper-text"
                        autoComplete="off"
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        multiline
                        helperText={descriptionError}
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
                        onClick={handleSave}
                        color="primary"
                        id="submitEditTaskButton"
                    >
                        Submit edit
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
export default EditTaskDialog
