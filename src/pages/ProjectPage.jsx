import React, { useState } from 'react'
import { Grid, Button, Card, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import useProjectById from '../graphql/project/hooks/useProjectById'
import NewBoardForm from '../components/board/NewBoardForm'
import NewUserForm from '../components/user/NewUserForm'
import { projectPageStyles } from '../styles/styles'
import '../styles.css'
import useProjectSubscriptions from '../graphql/subscriptions/useProjectSubscriptions'
import Header from '../components/utils/Header'
import Blob1 from '../pics/Blob.svg'
import Blob2 from '../pics/Blob2.svg'

const ProjectPage = ({ id, eventId }) => {
    const queryResult = useProjectById(id)
    const [open, setOpen] = useState(false)
    const classes = projectPageStyles()

    const handleClickOpen = () => {
        setOpen(true)
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
            <Grid
                item
                container
                direction="row"
                classes={{ root: classes.projectPageMainGrid }}
            >
                <Grid item container direction='column' classes={{ root: classes.projectPageLeftGrid }}>
                    <Grid item container direction='column' classes={{ root: classes.projectPageBoardsGrid }}>
                        <Grid item classes={{ root: classes.projectPageTitles }}><p>Boards</p></Grid>
                        <Grid item container direction='row' classes={{ root: classes.projectPageBoardCardGrid }} spacing={2}>
                            {boardsInOrder.map(({ id, name, ticketCount, color }) => (
                                <Grid item key={id}>
                                    <Link to={`/boards/${id}`} className="board_button">
                                        <Card classes={{ root: classes.boardCard }}>
                                            <Grid item container direction='row' classes={{ root: classes.boardCardRowGrid }} justify='space-between'>
                                                <Grid item container direction='column' justify='space-between' classes={{ root: classes.boardCardColumnGrid }}>
                                                    <Grid item>
                                                        <Typography classes={{ root: classes.boardCardName }}>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography classes={{ root: classes.boardCardTasks }}>{ticketCount ? ticketCount + ' tasks' : '0 tasks'}</Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item classes={{ root: classes.boardCardBlob1 }} style={{ backgroundImage: color === 0 ? `url(${Blob1})` : `url(${Blob2})` }}></Grid>
                                            </Grid>
                                        </Card>
                                    </Link>
                                </Grid>
                            ))}
                            <Grid item>
                                <Button classes={{ root: classes.addBoardButton }} onClick={() => handleClickOpen()}>+ Create new board</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item container direction='column'>
                        <Grid item classes={{ root: classes.projectPageTitles }}><p>Data</p></Grid>
                    </Grid>
                </Grid>
                <Grid item container direction='column' classes={{ root: classes.projectPageRightGrid }}>
                    <Grid item classes={{ root: classes.projectPageTitles }}><p>History</p></Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
export default ProjectPage
