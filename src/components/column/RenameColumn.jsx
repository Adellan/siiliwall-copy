import React, { useState, useEffect } from 'react'
import EditText from 'react-editext'
import { Grid } from '@material-ui/core'
import useEditColumn from '../../graphql/column/hooks/useEditColumn'
import { boardPageStyles } from '../../styles/styles'

const RenameColumn = ({ editId, column }) => {
    const [editColumn] = useEditColumn()
    const [name, setName] = useState(column?.name)
    const classes = boardPageStyles()
    const nameLimit = 19
    const dots = '...'

    useEffect(() => {
        setName(column.name)
    }, [column.name])

    const add3Dots = () => {
        let checkedName = name
        if (name.length > nameLimit) {
            checkedName = name.substring(0, nameLimit) + dots
        }
        return checkedName
    }

    const handleSave = (newName) => {
        const eventId = window.localStorage.getItem('eventId')
        editColumn({
            variables: {
                columnId: editId,
                columnName: newName,
                boardId: column.board.id,
                eventId
            },
        })
    }

    return (
        <Grid item classes={{ root: classes.columnName }}>
            <EditText
                showButtonsOnHover
                submitOnEnter
                cancelOnEscape
                editOnViewClick
                cancelOnUnfocus
                type="text"
                value={add3Dots(name)}
                onSave={handleSave}
                validationMessage="Name has to have 1 or more characters"
                validation={(val) => val.length > 0}
            />
        </Grid>
    )
}

export default RenameColumn
