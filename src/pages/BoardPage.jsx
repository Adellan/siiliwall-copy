import React, { useState, useEffect } from 'react'
import {
    Grid,
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
import { filterBoardByOption } from '../utils/boardFiltering'

const BoardPage = ({ id, eventId }) => {
    useEffect(() => () => {
        client.resetStore()
    }, [])
    const classes = boardPageStyles()
    const [view, toggleView] = useState('kanban')
    const [filter, setFilter] = useState('')
    const [filterOptions, setFilterOptions] = useState(['User'])
    const [selectedUser, setSelectedUser] = useState('')
    const [filterSelector, setFilterSelector] = useState(false)
    const [optionSelector, setOptionSelector] = useState(false)
    const [filteredBoard, setFilteredBoard] = useState(null)
    const queryResult = useBoardById(id)
    useBoardSubscriptions(id, eventId)

    if (queryResult.loading) return null
    const board = queryResult.data.boardById
    const { users } = board
    const userNames = users.map(user => user.userName)

    const switchView = (viewParam) => {
        toggleView(viewParam)
    }

    const switchFilter = (event) => {
        setFilter(event.target.value)
    }

    const selectUser = (event) => {
        setSelectedUser(event.target.value)
    }

    const openFilterSelector = () => {
        setFilterSelector(true)
    }

    const closeFilterSelector = () => {
        setFilterSelector(false)
    }

    const openOptionSelector = () => {
        setOptionSelector(true)
    }

    const closeOptionSelector = () => {
        setOptionSelector(false)
    }

    return (
        <Grid
            container
            direction="column"
            classes={{ root: classes.root }}
            id="boardElement"
        >
            <Header boardName={board.name} boardPrettyId={board.prettyId} switchView={switchView} view={view} />
            {view === 'kanban' && (
                <Grid item classes={{ root: classes.invisibleGrid }}></Grid>
            )}
            <Grid item container direction='row' alignItems='center' spacing={2} classes={{ root: classes.filterGrid }}>
                <Grid item>Filter by</Grid>
                <Grid item>
                    <FormControl classes={{ root: classes.filterForm }}>
                        <Select
                            open={filterSelector}
                            onClose={closeFilterSelector}
                            onOpen={openFilterSelector}
                            value={filter}
                            onChange={switchFilter}
                            MenuProps={{
                                anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "left"
                                },
                                transformOrigin: {
                                    vertical: "top",
                                    horizontal: "left"
                                },
                                getContentAnchorEl: null
                            }}
                        >
                            {filterOptions.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    {filter && (
                        <FormControl classes={{ root: classes.filterForm }}>
                            <Select
                                open={optionSelector}
                                onClose={closeOptionSelector}
                                onOpen={openOptionSelector}
                                value={selectedUser}
                                onChange={selectUser}
                                MenuProps={{
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left"
                                    },
                                    transformOrigin: {
                                        vertical: "top",
                                        horizontal: "left"
                                    },
                                    getContentAnchorEl: null
                                }}
                            >
                                {userNames.map((name, index) => <MenuItem key={index} value={name}>{name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    )}
                </Grid>
                {selectedUser && (
                    <Grid item>
                        <Button classes={{ root: classes.filterButton }} onClick={() => filterBoardByOption(setFilteredBoard, board, selectedUser)}>Filter</Button>
                    </Grid>
                )}
            </Grid>
            <Grid item>
                {view === 'kanban' ? <Board board={filteredBoard ? filteredBoard : board} /> : <SwimlaneView board={board} />}
            </Grid>
        </Grid>
    )
}
export default BoardPage
