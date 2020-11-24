import React from 'react'
import { ExpandMore, ExpandLess } from '@material-ui/icons'
import { Grid, IconButton } from '@material-ui/core'
import { swimlaneStyles } from '../../styles/styles'
import DropdownTask from '../task/DropdownTask'

const SwimlaneHeaderRow = ({
    task, column, boardId, prettyId, title, numberOfSubtasks, handleShowClick, toggleEditTaskDialog, show,
}) => {
    const classes = swimlaneStyles()
    const handleDialogClick = (e) => e.stopPropagation()

    return (
        <Grid container item direction="row" classes={{ root: classes.swimlaneHeaderRow }} onClick={(e) => toggleEditTaskDialog(e)}>
            <Grid item container spacing={3} classes={{ root: classes.swimlaneHeaderRowLeft }}>
                <Grid item>
                    <IconButton
                        onClick={(e) => handleShowClick(e)}
                    >
                        {!show
                            ? <ExpandMore />
                            : <ExpandLess />}
                    </IconButton>
                </Grid>
                <Grid item classes={{ root: classes.swimlanePrettyId }}><p>{prettyId}</p></Grid>
                <Grid item classes={{ root: classes.swimlaneTitle }}><p>{title}</p></Grid>
            </Grid>
            <Grid item container spacing={3} classes={{ root: classes.swimlaneHeaderRowRight }} justify="flex-end">
                <Grid item classes={{ root: classes.swimlaneNumberOfSubtasks }}>{numberOfSubtasks}</Grid>
                <Grid item classes={{ root: classes.taskDropdownButtonSwimlane }} onClick={(e) => handleDialogClick(e)}>
                    <DropdownTask
                        task={task}
                        column={column}
                        boardId={boardId}
                        calledFromSwimlane={true}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default SwimlaneHeaderRow
