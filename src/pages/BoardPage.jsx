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
    const boardsTickets = board.columns.map(column => column.tasks.concat(column.subtasks)).flat()

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
    console.log(board)
    const filterBoardByOption = () => {
        setFilteredBoard(board)
        let filteredTicketList = []
        // We go through the array of tickets in the board and push tickets which owner or member the selected user is
        boardsTickets.map(ticket => {
            if (ticket.owner && ticket.owner.userName === selectedUser) {
                filteredTicketList.push(ticket)
            } else if (ticket.members && ticket.members.find(member => member.userName === selectedUser)) {
                filteredTicketList.push(ticket)
            }
        })
        // We create an array of all the boards ticketOrderObjects
        const ticketOrderOfBoard = board.columns.map(column => column.ticketOrder).flat()
        // We create an array where we include only the ticketOrderObjects that belong to the selected user
        const filteredTicketOrder = filteredTicketList.map(ticket => ticketOrderOfBoard.find(ticketOrderObj => ticketOrderObj.ticketId === ticket.id))
        // We go through the board's columns and create a new array of their ticketOrders where we only show tickets belonging to the selected user
        const newTicketOrdersForColumns = board.columns.map(column => column.ticketOrder).map(colTicketOrderArr =>
            colTicketOrderArr.filter(colTicketOrderObj =>
                filteredTicketOrder.find(ticketOrderObj => ticketOrderObj.ticketId === colTicketOrderObj.ticketId)))
        // We create a copy of boards columns with filtered ticketOrders
        const filteredColumns = board.columns.map((column, index) => {
            column = Object.assign({}, column, { ticketOrder: newTicketOrdersForColumns[index] })
            return column
        })
        //const filteredTasks = board.columns.map(column => column.tasks.map
        // Finally we set the filteredBoard state to be a copy of the original except for the array of columns 
        setFilteredBoard(prevState => ({ ...prevState, columns: filteredColumns }))

        return filteredTicketList
    }
    console.log('filteredBoard', filteredBoard)

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
                        <Button classes={{ root: classes.filterButton }} onClick={() => filterBoardByOption()}>Filter</Button>
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
