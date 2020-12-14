import React from 'react'
import { Grid } from '@material-ui/core'
import Swimlane from './Swimlane'
import { swimlaneStyles } from '../../styles/styles'

const SwimlaneList = ({ tasksInOrder, showAll, boardId }) => {
    const classes = swimlaneStyles()

    return (
        <Grid container direction="column" classes={{ root: classes.swimlaneListComponent }}>
            {tasksInOrder.map((task, index) => <Grid item key={task.id} index={index}><Swimlane tasksInOrder={tasksInOrder} task={task} index={index} showAll={showAll} boardId={boardId} /></Grid>)}
        </Grid>
    )
}
export default SwimlaneList
