import { gql } from '@apollo/client'

export const TASK_BY_ID = gql`
    query taskById($taskId: ID!) {
        taskById(id: $taskId) {
            id
            title
            size
            owner{
                id
            }
            members{
                id
            }
            description
        }
    }
`

export const ADD_TASK = gql`
    mutation createTask($boardId: ID!, $columnId: ID!, $title: String!, $size: Int, $ownerId: ID, $memberIds: [ID!], $colorIds: [ID!], $description: String, $eventId: ID!) {
        addTaskForColumn(boardId: $boardId, columnId: $columnId, title: $title, size: $size, ownerId: $ownerId, memberIds: $memberIds, colorIds: $colorIds, description: $description, eventId: $eventId) {
            id
            prettyId
            title
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
            description
            swimlaneOrderNumber
            column {
                id
            }
            board {
                id
            }
        }
    }
`

export const DELETE_TASK = gql`
    mutation deleteTask($taskId: ID!, $columnId: ID!, $boardId: ID!, $eventId: ID!, $prettyId: String!) {
        deleteTaskById(id: $taskId, columnId: $columnId, boardId: $boardId, eventId: $eventId, prettyId: $prettyId)
    }
`

export const EDIT_TASK = gql`
    mutation editTask($taskId: ID!, $title: String!, $size: Int, $ownerId: ID, $oldMemberIds: [ID!], $newMemberIds: [ID!], $oldColorIds: [ID!], $newColorIds: [ID!], $description: String, $eventId: ID!) {
        editTaskById(id: $taskId, title: $title, size: $size, ownerId: $ownerId, oldMemberIds: $oldMemberIds, newMemberIds: $newMemberIds, oldColorIds: $oldColorIds, newColorIds: $newColorIds, description: $description, eventId: $eventId) {
            id
            prettyId
            title
            size
            owner {
                id
                userName
            }
            colors {
                id
                color
            }
            members {
                id
                userName
            }
            description
            swimlaneOrderNumber
            column {
                id
            }
            board {
                id
            }
            
        }
    }
`
export const ARCHIVE_TASK = gql`
    mutation archiveTask($taskId: ID!, $columnId: ID!, $boardId: ID!, $eventId: ID!, $prettyId: String!) {
        archiveTaskById(id: $taskId, columnId: $columnId, boardId: $boardId, eventId: $eventId, prettyId: $prettyId)
    }
`

export const MOVE_SWIMLANE = gql`
    mutation moveSwimlane($boardId: ID!, $affectedSwimlanes: [newSwimlaneOrderInput!]!, $swimlaneOrder: [ID!]!, $eventId: ID!) {
        moveSwimlane(boardId: $boardId, affectedSwimlanes: $affectedSwimlanes, swimlaneOrder: $swimlaneOrder, eventId: $eventId) 
    }
`
export const TASK_MUTATED = gql`
  subscription taskMutated($boardId: ID!, $eventId: ID!) {
    taskMutated(boardId: $boardId, eventId: $eventId) {
      mutationType
      node {
        id
        prettyId
        title
        size
        colors {
            id
            color
        }
        owner {
            id
            userName
        }
        members {
            id
            userName
        }
        description
        swimlaneOrderNumber
        column {
            id
        }
        board {
            id
        }
      }
    }
  }
`

export const TASK_REMOVED = gql`
  subscription taskRemoved($boardId: ID!, $eventId: ID!) {
    taskRemoved(boardId: $boardId, eventId: $eventId) {
      removeType
      removeInfo {
          taskId
          columnId
          boardId
          prettyId
      }
    }
  }
`

export const SWIMLANE_MOVED = gql`
subscription swimlaneMoved($boardId: ID!, $eventId: ID!) {
    swimlaneMoved(boardId: $boardId, eventId: $eventId) {
        boardId
        affectedSwimlanes {
            id
            swimlaneOrderNumber
        }
        swimlaneOrder
    }
  }
`
export const ALL_COLORS = gql`
    query {
        allColors {
            id
            color
        }
    }
`