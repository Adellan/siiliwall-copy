import React, { useState, useEffect } from 'react'
import {
    Grid,
    MenuItem,
    FormControl,
    Select,
    Button
} from '@material-ui/core'
import { filterBoardByOption } from '../../utils/boardFiltering'

const BoardFilter = ({ filteredBoard, setFilteredBoard, board, classes }) => {
    const [filter, setFilter] = useState('')
    const [filterOptions, setFilterOptions] = useState(['Users'])
    const [selectedUser, setSelectedUser] = useState('')
    const [filterSelector, setFilterSelector] = useState(false)
    const [optionSelector, setOptionSelector] = useState(false)
    const { users } = board
    const userNames = users.map(user => user.userName)

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

    const handleFilterClear = () => {
        setFilteredBoard(board)
    }

    return (
        <Grid item container direction='row' alignItems='center' spacing={2} classes={{ root: classes.filterGrid }}>
            <Grid item ><p style={{ fontFamily: 'Arial Regular' }}>Filter from</p></Grid>
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
            {filter && (
                <Grid item container direction='row' alignItems='center' style={{ width: 'auto' }} spacing={2}>
                    <Grid item><p style={{ fontFamily: 'Arial Regular' }}>by the name of</p></Grid>
                    <Grid item>
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
                    </Grid>
                </Grid>
            )
            }
            {
                selectedUser && (
                    <Grid item container style={{ width: 'auto' }}>
                        {
                            filteredBoard && filteredBoard !== board && (
                                <Grid item>
                                    <Button onClick={() => handleFilterClear()}>Clear</Button>
                                </Grid>
                            )
                        }
                        <Grid item>
                            <Button classes={{ root: classes.filterButton }} onClick={() => filterBoardByOption(setFilteredBoard, board, selectedUser)}>Filter</Button>
                        </Grid>
                    </Grid>
                )
            }
        </Grid >
    )
}
export default BoardFilter