const { withFilter } = require('graphql-subscriptions')
const dataSources = require('../../datasources')
const { pubsub } = require('../pubsub')

const SWIMLANE_MOVED = 'SWIMLANE_MOVED'
const BOARD_ADDED = 'BOARD_ADDED'

const schema = {
    Query: {
        boardById(root, args) {
            return dataSources.boardService.getBoardById(args.id)
        },
    },

    Subscription: {
        swimlaneMoved: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(SWIMLANE_MOVED),
                (payload, args) => (
                    args.boardId === payload.boardId && args.eventId !== payload.eventId
                ),
            ),
        },
        boardAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(BOARD_ADDED),
                (payload, args) => (
                    args.projectId === payload.projectId && args.eventId !== payload.eventId
                ),
            ),
        },
    },

    Mutation: {
        async addBoard(root, {
            name, prettyId, color, eventId, projectId,
        }) {
            const addedBoard = await dataSources.boardService
                .addBoard(name, prettyId, color, projectId)
            pubsub.publish(BOARD_ADDED, {
                projectId,
                eventId,
                boardAdded: {
                    mutationType: 'CREATED',
                    board: addedBoard.dataValues,
                },
            })
            return addedBoard
        },

        moveSwimlane(root, {
            boardId, affectedSwimlanes, swimlaneOrder, eventId,
        }) {
            pubsub.publish(SWIMLANE_MOVED, {
                boardId,
                eventId,
                swimlaneMoved: {
                    boardId,
                    affectedSwimlanes,
                    swimlaneOrder,
                },
            })
            return dataSources.boardService.updateSwimlaneOrderNumbers(boardId, affectedSwimlanes)
        },
    },

    Board: {
        columns(root) {
            return dataSources.boardService.getColumnsByBoardId(root.id)
        },
        columnOrder(root) {
            return dataSources.boardService.getColumnOrderOfBoard(root.id)
        },
        swimlaneOrder(root) {
            return dataSources.boardService.getSwimlaneOrderOfBoard(root.id)
        },

    },
}

module.exports = schema
