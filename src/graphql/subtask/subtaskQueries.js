import { gql } from '@apollo/client'

export const ADD_SUBTASK = gql`
    mutation createSubtask($taskId: ID!, $columnId: ID!, $boardId: ID!, $name: String, $content: String!, $size: Float, $ownerId: ID, $memberIds: [ID!], $colorIds: [ID!], $ticketOrder: [TicketOrderInput!], $eventId: ID!) {
        addSubtaskForTask(taskId: $taskId, columnId: $columnId, boardId: $boardId, name: $name, content: $content, size: $size, ownerId: $ownerId, memberIds: $memberIds, colorIds: $colorIds, ticketOrder: $ticketOrder, eventId: $eventId) {
            id
            prettyId
            name
            content
            size
            column {
                id
                ticketOrder {
                    ticketId
                    type
                }
            }
            owner {
                id
                userName
            }
            task {
                id
                prettyId
                title
            }
            members {
                id
                userName
            }
            colors {
                id
                color
            }
            board {
                id
            }
        }
    }
`
export const EDIT_SUBTASK = gql`
    mutation editSubtask($id: ID!, $name: String, $content: String!, $size: Float, $ownerId: ID, $oldMemberIds: [ID!], $newMemberIds: [ID!], $oldColorIds: [ID!], $newColorIds: [ID!], $eventId: ID!) {
        editSubtaskById(id: $id, name: $name, content: $content, size: $size, ownerId: $ownerId, oldMemberIds: $oldMemberIds, newMemberIds: $newMemberIds, oldColorIds: $oldColorIds, newColorIds: $newColorIds, eventId: $eventId) {
            id
            name
            content
            size
            owner {
                id
                userName
            }
            members {
                id
                userName
            }
            colors {
                id
                color
            }
        }
    }
`

export const ARCHIVE_SUBTASK = gql`
    mutation archiveSubtask($subtaskId: ID!, $columnId: ID!, $boardId: ID!, $eventId: ID!, $prettyId: String!) {
        archiveSubtaskById(id: $subtaskId, columnId: $columnId, boardId: $boardId, eventId: $eventId, prettyId: $prettyId)
    }
`

export const DELETE_SUBTASK = gql`
    mutation deleteSubtask($subtaskId: ID!, $columnId: ID!, $boardId: ID!, $eventId: ID!) {
        deleteSubtaskById(id: $subtaskId, columnId: $columnId, boardId: $boardId, eventId: $eventId)
    }
`
export const SUBTASK_REMOVED = gql`
    subscription subtaskRemoved($boardId: ID!, $eventId: ID!) {
        subtaskRemoved(boardId: $boardId, eventId: $eventId) {
            removeType
            removeInfo {
                subtaskId,
                columnId,
                boardId
                prettyId
            }
        }
    }
`

export const SUBTASK_MUTATED = gql`
  subscription subtaskMutated($boardId: ID!, $eventId: ID!) {
    subtaskMutated(boardId: $boardId, eventId: $eventId) {
      mutationType
      subtask {
        id
        prettyId
        name
        content
        size
        column {
            id
            ticketOrder {
                ticketId
                type
            }
        }
        owner {
            id
            userName
        }
        task {
            id
            prettyId
            title
        }
        members {
            id
            userName
        }
        colors {
            id
            color
        }
        board {
            id
        }
      }
    }
  }
`
