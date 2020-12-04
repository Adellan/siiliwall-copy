/* eslint-disable max-len */
const { withFilter } = require('graphql-subscriptions')
const dataSources = require('../../datasources')
const { pubsub } = require('../pubsub')

const TICKET_MOVED_IN_COLUMN = 'TICKET_MOVED_IN_COLUMN'
const TICKET_MOVED_FROM_COLUMN = 'TICKET_MOVED_FROM_COLUMN'
const COLUMN_DELETED = 'COLUMN_DELETED'
const COLUMN_CREATED = 'COLUMN_CREATED'
const COLUMN_EDITED = 'COLUMN_EDITED'


const schema = {
    Query: {
        columnById(root, args) {
            return dataSources.boardService.getColumnById(args.id)
        },
    },

    Subscription: {
        ticketMovedInColumn: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(TICKET_MOVED_IN_COLUMN),
                (payload, args) => (args.boardId === payload.boardId && args.eventId !== payload.eventId),

            ),
        },
        ticketMovedFromColumn: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(TICKET_MOVED_FROM_COLUMN),
                (payload, args) => (args.boardId === payload.boardId && args.eventId !== payload.eventId),
            ),
        },
        columnDeleted: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(COLUMN_DELETED),
                (payload, args) => (args.boardId === payload.boardId && args.eventId !== payload.eventId),
            ),
        },
        columnCreated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(COLUMN_CREATED),
                (payload, args) => (args.boardId === payload.boardId && args.eventId !== payload.eventId),
            ),
        },
        columnEdited: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(COLUMN_EDITED),
                (payload, args) => (args.boardId === payload.boardId && args.eventId !== payload.eventId),
            ),
        },
    },

    Mutation: {
        async addColumnForBoard(root, { boardId, name, eventId }) {
            let createdColumn
            try {
                createdColumn = await dataSources.boardService.addColumnForBoard(boardId, name)
                pubsub.publish(COLUMN_CREATED, {
                    boardId,
                    eventId,
                    columnCreated: {
                        column: createdColumn.dataValues,
                    },
                })
            } catch (e) {
                console.error(e)
            }
            return createdColumn
        },

        async editColumnById(root, {
            id, name, oldName, boardId, eventId,
        }) {
            let editedColumn
            try {
                editedColumn = await dataSources.boardService.editColumnById(id, name)
                pubsub.publish(COLUMN_EDITED, {
                    boardId,
                    eventId,
                    columnEdited: {
                        column: editedColumn.dataValues,
                        oldName
                    },
                })
            } catch (e) {
                console.log(e)
            }
            return editedColumn
        },

        async deleteColumnById(root, { id, boardId, eventId, name }) {
            let deletedColumnId
            try {
                deletedColumnId = await dataSources.boardService.deleteColumnById(id)
                pubsub.publish(COLUMN_DELETED, {
                    boardId,
                    eventId,
                    columnDeleted: {
                        removeType: 'DELETED',
                        removeInfo: { columnId: id, boardId, name },
                    },
                })
            } catch (e) {
                console.log(e)
            }
            return deletedColumnId
        },

        async moveTicketInColumn(root, {
            newOrder, columnId, snackbarInfo, boardId, eventId,
        }) {
            const modifiedColumn = await dataSources.boardService.reOrderTicketsOfColumn(newOrder, columnId)
            pubsub.publish(TICKET_MOVED_IN_COLUMN, {
                boardId,
                eventId,
                ticketMovedInColumn: {
                    newOrder,
                    columnId,
                    snackbarInfo
                },
            })
            return modifiedColumn
        },

        async moveTicketFromColumn(root, {
            type, ticketId, /*snackbarInfo,*/ sourceColumnId, destColumnId, sourceTicketOrder, destTicketOrder, eventId,
        }) {
            //console.log('haloo')
            await dataSources.boardService.changeTicketsColumnId(type, ticketId, destColumnId)
            const sourceColumn = await dataSources.boardService.reOrderTicketsOfColumn(sourceTicketOrder, sourceColumnId)
            const destColumn = await dataSources.boardService.reOrderTicketsOfColumn(destTicketOrder, destColumnId)
            pubsub.publish(TICKET_MOVED_FROM_COLUMN, {
                boardId: sourceColumn.boardId,
                eventId,
                ticketMovedFromColumn: {
                    ticketInfo: { ticketId, type },
                    //snackbarInfo,
                    sourceColumnId,
                    destColumnId,
                    sourceTicketOrder,
                    destTicketOrder,
                },
            })
            return [sourceColumn, destColumn]
        },
        async moveColumn(root, { boardId, newColumnOrder }) {
            await dataSources.boardService.reOrderColumns(newColumnOrder)
            return boardId
        },
    },

    Column: {
        board(root) {
            return dataSources.boardService.getColumnBoardByColumnId(root.id)
        },
        stories(root) {
            return dataSources.boardService.getStoriesByColumnId(root.id)
        },
        tasks(root) {
            return dataSources.boardService.getTasksByColumnId(root.id)
        },
        subtasks(root) {
            return dataSources.boardService.getSubtasksByColumnId(root.id)
        },
        ticketOrder(root) {
            return dataSources.boardService.getTicketOrderOfColumn(root.id)
        },
    },
}

module.exports = schema
