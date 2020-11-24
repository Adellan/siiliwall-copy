import React from 'react'
import { Grid } from '@material-ui/core'
import { boardPageStyles } from '../../styles/styles'

const MemberCircle = ({ name }) => {
    const classes = boardPageStyles()
    return (
        <Grid item container>
            <Grid item container direction='column' justify='center' classes={{ root: classes.memberCircle }}>
                <Grid item><p>{name.charAt(0).toUpperCase()}</p></Grid>
            </Grid>
        </Grid>
    )
}
export default MemberCircle