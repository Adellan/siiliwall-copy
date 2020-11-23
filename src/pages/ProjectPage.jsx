import React, { useState } from 'react'
import { Grid, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'
import useProjectById from '../graphql/project/hooks/useProjectById'
import NewBoardForm from '../components/board/NewBoardForm'
import NewUserForm from '../components/user/NewUserForm'
import { projectPageStyles } from '../styles/styles'
import '../styles.css'
import useProjectSubscriptions from '../graphql/subscriptions/useProjectSubscriptions'
import Header from '../components/Header'

const ProjectPage = ({ id, eventId }) => {
    const queryResult = useProjectById(id)
    const [open, setOpen] = useState(false)
    const [openUserForm, setUserFormOpen] = useState(false)
    const classes = projectPageStyles()
    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClickOpenUser = () => {
        setUserFormOpen(true)
    }

    useProjectSubscriptions(id, eventId)

    if (queryResult.loading) return null
    const boardsInOrder = queryResult.data.projectById.boards.slice().sort((a, b) => a.orderNumber - b.orderNumber)
    const projectName = queryResult.data.projectById.name

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            classes={{ root: classes.root }}
        >
            <Header projectName={projectName} />
            {open && <NewBoardForm setOpen={setOpen} open={open} projectId={id} />}
            {openUserForm && <NewUserForm setOpen={setUserFormOpen} open={openUserForm} />}
            <Grid item classes={{ root: classes.title }}>
                <h1 id="landingTitle">{projectName}</h1>
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
                        Add Board
                    </Button>
                </Grid>
                <Grid item>
                    <Button onClick={handleClickOpenUser} classes={{ root: classes.addNewButton }}>
                        Add User
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
                {boardsInOrder.map(({ id, name }) => (
                    <Grid item classes={{ root: classes.boardButtonGrid }} key={id}>
                        <Link to={`/boards/${id}`} className="boardList__button__link">
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
export default ProjectPage
