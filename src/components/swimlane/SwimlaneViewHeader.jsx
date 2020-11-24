import React from 'react'
import { Grid } from '@material-ui/core'
import { swimlaneStyles } from '../../styles/styles'
import SwimlaneColumnName from './SwimlaneColumnName'

const SwimlaneViewHeader = ({ columns }) => {
    const classes = swimlaneStyles()

    return (
        <Grid container direction="row" classes={{ root: classes.swimlaneColumnNames }}>
            {columns.map((column, index) => (
                <SwimlaneColumnName column={column} key={column.id} isLeftMost={index === columns.length - 1} />
            ))}
        </Grid>
    )
}
export default SwimlaneViewHeader
