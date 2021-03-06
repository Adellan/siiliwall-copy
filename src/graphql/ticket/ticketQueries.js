import { gql } from '@apollo/client'

export const MOVE_TICKET_IN_COLUMN = gql`
    
    mutation moveTicketkInColumn($orderArray: [TicketOrderInput!]!, $columnId: ID!, $boardId: ID!, $eventId: ID!) {
        moveTicketInColumn(newOrder: $orderArray, columnId: $columnId, boardId: $boardId, eventId: $eventId) {
            id
        }
    }
`

export const MOVE_TICKET_FROM_COLUMN = gql`
    mutation moveTicketFromColumn($type: String!, $ticketId: ID!, $sourceColumnId: ID!, $destColumnId: ID!, $sourceTicketOrder: [TicketOrderInput!]!, $destTicketOrder:  [TicketOrderInput!]!, $eventId: ID!) {
        moveTicketFromColumn(type: $type, ticketId: $ticketId, sourceColumnId: $sourceColumnId, destColumnId: $destColumnId, sourceTicketOrder: $sourceTicketOrder, destTicketOrder: $destTicketOrder, eventId: $eventId) {
            id
            subtasks {
                id
                column {
                    id
                }
            }
            tasks {
                id
                column {
                    id
                }
            }
        }
    }    
`

export const TICKET_MOVED_IN_COLUMN = gql`
  subscription ticketMovedInColumn($boardId: ID!, $eventId: ID!) {
    ticketMovedInColumn(boardId: $boardId, eventId: $eventId) {
      newOrder {
          ticketId
          type
      }
      columnId
    }
  }
`

export const TICKET_MOVED_FROM_COLUMN = gql`
  subscription ticketMovedFromColumn($boardId: ID!, $eventId: ID!) {
    ticketMovedFromColumn(boardId: $boardId, eventId: $eventId) {
        ticketInfo { 
            ticketId
            type
        }
        sourceColumnId
        destColumnId
        sourceTicketOrder { 
            ticketId
            type
        }
        destTicketOrder { 
            ticketId
            type
        }
    }
  }
`
