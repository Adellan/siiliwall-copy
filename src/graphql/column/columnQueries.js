/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client'

export const ADD_COLUMN = gql`
    mutation addColumnForBoard($boardId: ID!, $columnName: String!, $eventId: ID!) {
        addColumnForBoard(boardId: $boardId, columnName: $columnName, eventId: $eventId) {
            id
            name
            board {
                id
            }
        }
    }
`

export const MOVE_COLUMN = gql`
    mutation moveColumn($orderArray: [ID!]!, $boardId: ID!, $eventId: ID!) {
        moveColumn(boardId: $boardId, newColumnOrder: $orderArray, eventId: $eventId)
    }
`

export const DELETE_COLUMN = gql`
    mutation deleteColumn($columnId: ID!, $boardId: ID!, $eventId: ID!) {
        deleteColumnById(id: $columnId, boardId: $boardId, eventId: $eventId)
    }
`
export const EDIT_COLUMN = gql`
    mutation editColumn($columnId: ID!, $columnName: String!, $boardId: ID!, $eventId: ID!) {
        editColumnById(id: $columnId, name: $columnName, boardId: $boardId, eventId: $eventId ) {
            id
            name
        }
    }
`

export const COLUMN_MUTATED = gql`
    subscription columnMutated($boardId: ID!, $eventId: ID!) {
        columnMutated(boardId: $boardId, eventId: $eventId) {
            mutationType
            column {
                id
                name
                orderNumber
                board {
                    id
                }
            }
        }
    }
`

export const COLUMN_DELETED = gql`
    subscription columnDeleted($boardId: ID!, $eventId: ID!) {
        columnDeleted(boardId: $boardId, eventId: $eventId) {
            removeType
            removeInfo {
                columnId
                boardId
            }
        }
    }
`
export const COLUMN_MOVED = gql`
    subscription columnMoved($boardId: ID!, $eventId: ID!) {
        columnMoved(boardId: $boardId, eventId: $eventId) {
            boardId
            eventId
            newColumnOrder
        }
    }
`
