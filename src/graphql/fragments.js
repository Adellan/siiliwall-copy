/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client'

export const PROJECTS_BOARDS = gql`
    fragment projectsBoards on Project {
        id
        boards {
            id
        }
    }
`

export const TICKETORDER_AND_TASKS = gql`
    fragment ticketOrderAndTasks on Column {
        ticketOrder
        tasks {
            id
        }
    }
`
export const TASK_SUBTASKS = gql`
    fragment tasksSubtasks on Task {
        id
        subtasks {
            id
        }
    }
`
export const TASKS_WITH_SUBTASKS = gql`
    fragment tasksWithSubtasks on Column {
        tasks {
            id
            subtasks {
                id
            }
        } 
    }
`
export const TICKETORDER_AND_SUBTASKS = gql`
    fragment ticketOrderAndSubtasks on Column {
        ticketOrder
        subtasks {
            id
        }
    }
`

export const TICKETORDER_AND_TICKETS = gql`
    fragment ticketOrderAndTickets on Column {
        ticketOrder
        tasks {
            id
        } 
        subtasks {
            id
        }
    }
`

export const TICKETORDER = gql`
    fragment ticketOrder on Column {
        ticketOrder
    }
`

export const SUBTASKS = gql`
    fragment subtasks on Column {
        subtasks {
            id
        }
    }
`
export const SUBTASKS_OF_BOARD = gql`
    fragment subtasksOfBoard on Board {
        subtasks {
            id
        }
    }
`
export const PRIORITIZED_AND_SWIMLANEORDERNUMBER = gql`
    fragment prioritizedAndSwimlaneOrderNumber on Task {
        prioritized
        swimlaneOrderNumber
    }
`

export const COLUMNORDER = gql`
    fragment columnOrder on Board {
        columnOrder
}
`

export const COLUMNORDER_AND_COLUMNS = gql`
    fragment columnOrderAndColumns on Board {
        columnOrder
        columns {
            subtasks {
                id
                task {
                    id
                }
                column {
                    id
                }
            }
        }
    }
`

export const SUBTASKS_COLUMN = gql`
    fragment column on Subtask {
        column {
            id
        }
    }
`

export const BOARDS_COLUMNS_AND_COLUMNORDER = gql`
    fragment columns on Board {
        columnOrder
        columns {
            id
            name
        }
    }
`

export const SWIMLANE_ORDER = gql`
    fragment swimlaneOrder on Board {
        swimlaneOrder
    }
`

export const SWIMLANE_ORDER_NUMBER = gql`
    fragment swimlaneOrderNumber on Task {
        swimlaneOrderNumber
    }
`
export const BOARD_ID_BY_COLUMN_ID = gql`
    fragment boardIdByColumnId on Column {
        board {
            id
        }
    }
`
