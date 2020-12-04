import React, { useState } from 'react'
import { Grid, TextField, Button } from '@material-ui/core'
import Column from './Column'
import { boardPageStyles } from '../../styles/styles'
import useAddColumn from '../../graphql/column/hooks/useAddColumn'
import { useSnackbarContext } from '../../contexts/SnackbarContext'

const ColumnList = ({ columns, columnOrder, boardId }) => {
    const classes = boardPageStyles()
    const [name, setName] = useState('')
    const [addColumn] = useAddColumn()
    const { setSnackbarMessage } = useSnackbarContext()

    const handleChange = (event) => {
        setName(event.target.value)
    }

    const handleSave = () => {
        const eventId = window.localStorage.getItem('eventId')
        addColumn({
            variables: {
                boardId,
                name,
                eventId,
            },
        })
        setName('')
        setSnackbarMessage(`New column ${name} created`)
    }

    const newColumnOrder = columnOrder.map((id) => columns.find((column) => column.id === id))
    return (
        <Grid container direction="row" spacing={4} classes={{ root: classes.columnRow }}>
            {newColumnOrder.map((column, index) => (
                <Grid item key={column.id}>
                    <Column column={column} index={index} />
                </Grid>
            ))}
            <Grid item classes={{ root: classes.addColumn }}>
                <TextField
                    margin="dense"
                    name="title"
                    label="Name"
                    type="text"
                    value={name}
                    fullWidth
                    onChange={handleChange}
                    id="inputname"
                />
                <Button
                    disabled={!name.length}
                    color="primary"
                    onClick={handleSave}
                    id="addColumnButton"
                >
                    Add
                </Button>
            </Grid>
        </Grid>
    )
}
export default ColumnList
