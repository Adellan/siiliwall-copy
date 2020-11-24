import React from 'react'
import {
    Grid,
} from '@material-ui/core'
import ViewAgendaOutlinedIcon from '@material-ui/icons/ViewAgendaOutlined'
import ViewWeekOutlinedIcon from '@material-ui/icons/ViewWeekOutlined'
import { headerStyles } from '../../styles/styles'
import Hedgehog from './Hedgehog'

const Header = (props) => {
    const {
        boardName, boardPrettyId, switchView, projectName, landing, view,
    } = props
    const classes = headerStyles()

    return (
        <Grid
            data-cy="boardName"
            container
            item
            direction="row"
            classes={{ root: classes.header }}
            id="boardHeader"
            alignItems="center"
        >
            {boardName && (
                <>
                    <Grid item container direction="row" alignItems="center" classes={{ root: classes.boardHeaderLeft }} spacing={2}>
                        <Grid item>
                            <Hedgehog />
                        </Grid>
                        <Grid item container classes={{ root: classes.headerTitle }} direction="column">
                            <Grid item classes={{ root: classes.headerPrettyId }}>
                                {boardPrettyId}
                            </Grid>
                            <Grid item>
                                <p>{boardName}</p>
                            </Grid>

                        </Grid>
                    </Grid>
                    <Grid item container classes={{ root: classes.boardHeaderRight }} justify="flex-end">
                        <Grid item container justify="center" alignItems="center">
                            <Grid item classes={{ root: classes.toggleKanbanButton }} style={{ backgroundColor: view === 'kanban' ? '#F5F5F5' : '#949494' }} onClick={() => switchView('kanban')}>
                                <ViewWeekOutlinedIcon classes={{ root: classes.toggleViewButtonIcon }} />
                            </Grid>
                            <Grid item classes={{ root: classes.toggleSwimlaneButton }} style={{ backgroundColor: view === 'swimlane' ? '#F5F5F5' : '#949494' }} onClick={() => switchView('swimlane')}>
                                <ViewAgendaOutlinedIcon classes={{ root: classes.toggleViewButtonIcon }} />
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            )}
            {(projectName || landing) && (
                <>
                    <Grid item container direction="row" alignItems="center" classes={{ root: classes.boardHeaderLeft }} spacing={2}>
                        <Grid item>
                            <Hedgehog />
                        </Grid>
                        <Grid item container classes={{ root: classes.headerTitle }} direction="column">
                            <Grid item>
                                <p>{landing ? 'SiiliWall' : projectName}</p>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            )}

        </Grid>

    )
}

export default Header
