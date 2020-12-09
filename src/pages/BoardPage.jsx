import React, { useState, useEffect } from 'react'
import {
    Grid,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Button
} from '@material-ui/core'
import Board from '../components/board/Board'
import SwimlaneView from '../components/swimlane/SwimlaneView'
import { boardPageStyles } from '../styles/styles'
import useBoardById from '../graphql/board/hooks/useBoardById'
import useBoardSubscriptions from '../graphql/subscriptions/useBoardSubscriptions'
import { client } from '../apollo'
import Header from '../components/utils/Header'

const BoardPage = ({ id, eventId }) => {
    useEffect(() => () => {
        client.resetStore()
    }, [])
    const classes = boardPageStyles()
    const [view, toggleView] = useState('kanban')
    const [filter, setFilter] = useState('')
    const [open, setOpen] = useState(false)
    const queryResult = useBoardById(id)
    useBoardSubscriptions(id, eventId)

    if (queryResult.loading) return null
    const board = queryResult.data.boardById
    console.log(board)
    // const users = boar
    const switchView = (viewParam) => {
        toggleView(viewParam)
    }

    const switchFilter = (event) => {
        setFilter(event.target.value)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Grid
            container
            direction="row"
            classes={{ root: classes.root }}
            id="boardElement"
        >
            <Header boardName={board.name} boardPrettyId={board.prettyId} switchView={switchView} view={view} />
            {view === 'kanban' && (
                <Grid item classes={{ root: classes.invisibleGrid }}></Grid>
            )}
            <Grid item>
                <Button onClick={handleOpen}>Filter by</Button>
                <FormControl>
                    <InputLabel>User</InputLabel>
                    <Select
                        open={open}
                        onClose={handleClose}
                        onOpen={handleOpen}
                    />
                </FormControl>
            </Grid>
            <Grid item>
                {view === 'kanban' ? <Board board={board} /> : <SwimlaneView board={board} />}
            </Grid>
        </Grid>
    )
}
export default BoardPage
