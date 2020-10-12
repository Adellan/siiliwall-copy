/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client'

export const TICKETORDER_AND_TASKS = gql`
    fragment ticketOrderAndTasks on Column {
        ticketOrder
        tasks {
            id
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

export const TASKORDER_AND_TASKS = gql`
    fragment taskOrderAndTasks on Column {
        taskOrder
        tasks {
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
export const TASKORDER = gql`
    fragment taskOrder on Column {
        taskOrder
    }
`
export const TICKETORDER = gql`
    fragment ticketOrder on Column {
        ticketOrder
    }
`
export const SWIMLANEORDER = gql`
    fragment swimlaneOrder on Board {
        swimlaneOrder
    }
`
export const SUBTASKS = gql`
    fragment subtasks on Column {
        subtasks {
            id
        }
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
        columns
}
`

export const SUBTASKS_COLUMN = gql`
    fragment column on Subtask {
        column {
            id
        }
    }
`
