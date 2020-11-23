import React, { useState } from 'react'
import { Grid, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { projectPageStyles } from '../styles/styles'
import '../styles.css'
import useAllProjects from '../graphql/project/hooks/useAllProjects'
import NewProjectForm from '../components/project/NewProjectForm'
import Header from '../components/Header'

const LandingPage = () => {
    const queryResult = useAllProjects()
    const [open, setOpen] = useState(false)
    const classes = projectPageStyles()

    const handleClickOpen = () => {
        setOpen(true)
    }

    if (queryResult.loading) return null
    const projectsInOrder = queryResult.data.allProjects.slice().sort((a, b) => a.orderNumber - b.orderNumber)

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            classes={{ root: classes.root }}
        >
            <Header landing={true} />
            {open && <NewProjectForm setOpen={setOpen} open={open} />}
            <Grid item classes={{ root: classes.title }}>
                <h1 id="landingTitle">Welcome!</h1>
            </Grid>
            <Grid
                item
                container
                direction="row"
                justify="center"
                spacing={3}
            >
                <Grid item>
                    <Button onClick={handleClickOpen} classes={{ root: classes.addNewButton }} id="addButton">
                        Add Project
                    </Button>
                </Grid>
            </Grid>
            <Grid
                item
                container
                direction="column"
                alignItems="center"
                spacing={2}
            >
                {projectsInOrder.map(({ id, name }) => (
                    <Grid item classes={{ root: classes.boardButtonGrid }} key={id}>
                        <Link to={`/projects/${id}`} className="boardList__button__link">
                            <Button fullWidth classes={{ root: classes.boardButton }}>
                                {name}
                            </Button>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    )
}
export default LandingPage
