import React from 'react'
import { ExpandMore, ExpandLess } from '@material-ui/icons'
import { Grid, IconButton } from '@material-ui/core'
import propsAreEqual from '../../utils/propsAreEqual'
import { swimlaneStyles } from '../../styles/styles'
import DropdownTask from '../task/DropdownTask'

const SwimlaneHeaderRow = ({
    task, columnId, columnName, boardId, prettyId, title, numberOfSubtasks, handleShowClick, toggleEditTaskDialog, show,
}) => {
    const classes = swimlaneStyles()
    const handleDialogClick = (e) => e.stopPropagation()

    return (
        <Grid container item direction="row" classes={{ root: classes.swimlaneHeaderRow }} onClick={(e) => toggleEditTaskDialog(e)}>
            <Grid item container classes={{ root: classes.swimlaneHeaderRowLeft }}>
                <Grid item classes={{ root: classes.swimlaneHeaderRowDropdownIcon }}>
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
            <Grid item container classes={{ root: classes.swimlaneHeaderRowRight }}>
                <Grid item classes={{ root: classes.swimlaneNumberOfSubtasks }}>{numberOfSubtasks}</Grid>
                <Grid item onClick={(e) => handleDialogClick(e)}>
                    <DropdownTask
                        task={task}
                        columnId={columnId}
                        columnName={columnName}
                        boardId={boardId}
                        calledFromSwimlane={true}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default React.memo(SwimlaneHeaderRow, propsAreEqual)
