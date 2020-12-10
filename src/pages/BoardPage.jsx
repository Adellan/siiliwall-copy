import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import Board from '../components/board/Board'
import SwimlaneView from '../components/swimlane/SwimlaneView'
import { boardPageStyles } from '../styles/styles'
import useBoardById from '../graphql/board/hooks/useBoardById'
import useBoardSubscriptions from '../graphql/subscriptions/useBoardSubscriptions'
import { client } from '../apollo'
import Header from '../components/utils/Header'
import BoardFilter from '../components/board/BoardFilter'

const BoardPage = ({ id, eventId }) => {
    useEffect(() => () => {
        client.resetStore()
    }, [])
    const classes = boardPageStyles()
    const [view, toggleView] = useState('kanban')
    const [filteredBoard, setFilteredBoard] = useState(null)
    const queryResult = useBoardById(id)
    useBoardSubscriptions(id, eventId)

    if (queryResult.loading) return null
    const board = queryResult.data.boardById

    const switchView = (viewParam) => {
        toggleView(viewParam)
    }
    console.log('board', board)
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
            <Grid item><BoardFilter filteredBoard={filteredBoard} setFilteredBoard={setFilteredBoard} board={board} classes={classes} /></Grid>
            <Grid item>
                {view === 'kanban' ? <Board board={filteredBoard ? filteredBoard : board} /> : <SwimlaneView board={board} />}
            </Grid>
        </Grid>
    )
}
export default BoardPage
