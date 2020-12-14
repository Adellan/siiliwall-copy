import React from 'react'
import { Grid } from '@material-ui/core'
import propsAreEqual from '../../utils/propsAreEqual'
import { swimlaneStyles } from '../../styles/styles'
import SwimlaneColumn from './SwimlaneColumn'

const SwimlaneColumnList = ({ swimlaneColumns, taskId, boardId }) => {
    const classes = swimlaneStyles()
    const mostSubtasks = Math.max(...swimlaneColumns.map((swimlaneColumn) => swimlaneColumn.subtasks.length))
    return (
        <Grid
            container
            direction="row"
            justify="space-evenly"
            classes={{ root: classes.swimlaneColumnList }}
        >
            {swimlaneColumns.map((swimlaneColumn, index) => (
                <Grid item key={swimlaneColumn.id}>
                    <SwimlaneColumn
                        swimlaneColumn={swimlaneColumn}
                        taskId={taskId}
                        isTheLeftMost={index === swimlaneColumns.length - 1}
                        mostSubtasks={mostSubtasks}
                        boardId={boardId}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default React.memo(SwimlaneColumnList, propsAreEqual)
