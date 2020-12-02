import React, { useState, useEffect } from 'react'
import {
    Dialog, Grid, Button, TextField, DialogContent, DialogActions, DialogTitle,
} from '@material-ui/core'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import useEditSubtask from '../../graphql/subtask/hooks/useEditSubtask'
import { boardPageStyles } from '../../styles/styles'
import useAllColors from '../../graphql/task/hooks/useAllColors'
import useAllUsers from '../../graphql/user/hooks/useAllUsers'
import { useSnackbarContext } from '../../contexts/SnackbarContext'

const EditSubtaskDialog = ({
    dialogStatus, editId, toggleDialog, subtask,
}) => {
    const [editSubtask] = useEditSubtask()
    const userQuery = useAllUsers()
    const colorQuery = useAllColors()
    const [name, setName] = useState()
    const [size, setSize] = useState()
    const [content, setContent] = useState(subtask.content)
    const [owner, setOwner] = useState()
    const arrayOfOldMemberIds = subtask.members.map((user) => user.id)
    const arrayOfOldColorIds = subtask?.colors?.map((color) => color.id)
    const [members, setMembers] = useState()
    const [colors, setColors] = useState()
    const animatedComponents = makeAnimated()
    const classes = boardPageStyles()
    const { setSnackbarMessage } = useSnackbarContext()

    useEffect(() => {
        setName(subtask.name)
        setSize(subtask.size)
        setContent(subtask.content)
        setOwner(subtask.owner ? subtask.owner.id : null)
        setMembers(subtask.members.length > 0 ? arrayOfOldMemberIds : [])
        setColors(subtask.colors.length > 0 ? arrayOfOldColorIds : [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subtask])

    if (userQuery.loading || colorQuery.loading) return null

    const handleOwnerChange = (action) => {
        setOwner(action != null ? action.value : null)
    }

    const handleSizeChange = (event) => {
        setSize(parseFloat(event.target.value))
    }

    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const handleContentChange = (event) => {
        setContent(event.target.value)
    }

    const handleMembersChange = (event) => {
        setMembers(Array.isArray(event) ? event.map((user) => user.value) : [])
    }

    const handleColorsChange = (event) => {
        setColors(Array.isArray(event) ? event.map((color) => color.value) : [])
    }

    const handleSave = (event) => {
        event.preventDefault()
        const eventId = window.localStorage.getItem('eventId')
        editSubtask({
            variables: {
                id: editId,
                name,
                content,
                size,
                ownerId: owner,
                oldMemberIds: arrayOfOldMemberIds,
                newMemberIds: members,
                oldColorIds: arrayOfOldColorIds,
                newColorIds: colors,
                eventId,
            },
        })
        toggleDialog()
        setSnackbarMessage('Changes saved')
    }

    const recoverState = () => {
        setName(subtask?.name)
        setSize(subtask?.size)
        setOwner(subtask?.owner ? subtask.owner.id : null)
        setMembers(subtask.members.length > 0 ? arrayOfOldMemberIds : [])
        setColors(subtask.colors.length > 0 ? arrayOfOldColorIds : [])
        setContent(subtask?.content)
    }

    const handleCancel = () => {
        recoverState()
        toggleDialog()
    }

    // Prevents closing dialog when clicking on it to edit subtask's fields
    const handleDialogClick = (e) => e.stopPropagation()

    // Modifiying userData to be of form expected by the react select component
    const modifiedUserData = userQuery.data.allUsers.map((user) => {
        const newObject = { value: user.id, label: user.userName }
        return newObject
    })

    const chosenMembersData = subtask.members.map((user) => {
        const newObject = { value: user.id, label: user.userName }
        return newObject
    })

    const modifiedColorData = colorQuery.data.allColors.map((color) => {
        const newObject = {
            value: color.id,
            label: color.color.charAt(0).toUpperCase() + color.color.slice(1),
        }
        return newObject
    })
    const chosenColorsData = subtask.colors.map((color) => {
        const newObject = {
            value: color.id,
            label: color.color.charAt(0).toUpperCase() + color.color.slice(1),
        }
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
                <DialogTitle aria-labelledby="max-width-dialog-title">
                    Edit subtask
                    <p className={classes.subtaskPrettyId}>{subtask.prettyId}</p>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        autoComplete="off"
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        value={name || ''}
                        fullWidth
                        onChange={handleNameChange}
                    />
                    <TextField
                        autoComplete="off"
                        margin="dense"
                        name="content"
                        label="Content"
                        type="text"
                        multiline
                        rows={3}
                        value={content}
                        fullWidth
                        onChange={handleContentChange}
                    />
                    <TextField
                        autoComplete="off"
                        margin="dense"
                        name="size"
                        label="Size"
                        type="text"
                        value={size || ''}
                        fullWidth
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
                    />
                    <Select
                        className="selectField"
                        isClearable
                        placeholder="Select owner"
                        options={modifiedUserData}
                        defaultValue={chosenOwnerData}
                        onChange={handleOwnerChange}
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
                        disabled={!name}
                    >
                        Submit edit
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
export default EditSubtaskDialog
