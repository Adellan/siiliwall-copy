import React, { useState, useEffect } from 'react'
import EditText from 'react-editext'
import { Grid } from '@material-ui/core'
import useEditColumn from '../../graphql/column/hooks/useEditColumn'
import { boardPageStyles } from '../../styles/styles'
import { useSnackbarContext } from '../../contexts/SnackbarContext'
import { add3Dots } from '../../utils/add3Dots'

const RenameColumn = ({ editId, column }) => {
    const [editColumn] = useEditColumn()
    const [name, setName] = useState(column?.name)
    const classes = boardPageStyles()
    const { setSnackbarMessage } = useSnackbarContext()
    const nameLimit = 16

    useEffect(() => {
        setName(column.name)
    }, [column.name])

    const handleSave = (newName) => {
        const eventId = window.localStorage.getItem('eventId')
        editColumn({
            variables: {
                columnId: editId,
                columnName: newName,
                boardId: column.board.id,
                eventId,
            },
        })
        setSnackbarMessage(`Renamed column ${column.name}`)
    }

    return (
        <Grid item classes={{ root: classes.columnName }} data-cy="editOnClick">
            <EditText
                showButtonsOnHover
                submitOnEnter
                cancelOnEscape
                editOnViewClick
                cancelOnUnfocus
                type="text"
                value={add3Dots(name, nameLimit)}
                onSave={handleSave}
                validationMessage="Name has to have 1 or more characters"
                validation={(val) => val.length > 0}
            />
        </Grid>
    )
}

export default RenameColumn
