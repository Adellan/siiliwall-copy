const dataSources = require('../../datasources')

const schema = {
    Query: {
        taskById(root, args) {
            return dataSources.boardService.getTaskById(args.id)
        },
    },

    Mutation: {
        addTaskForColumn(root, {
            columnId, title, size, ownerId, content,
        }) {
            return dataSources.boardService
                .addTaskForColumn(columnId, title, size, ownerId, content)
        },
        editTaskById(root, {
            id, title, size, ownerId,
        }) {
            return dataSources.boardService.editTaskById(id, title, size, ownerId)
        },
        deleteTaskById(root, { id }) {
            return dataSources.boardService.deleteTaskById(id)
        },
        archiveTaskById(root, { id }) {
            return dataSources.boardService.archiveTaskById(id)
        },
        restoreTaskById(root, { id }) {
            return dataSources.boardService.restoreTaskById(id)
        },
    },

    Task: {
        column(root) {
            return dataSources.boardService.getColumnById(root.columnId)
        },
        subtasks(root) {
            return dataSources.boardService.getSubtasksByTaskId(root.id)
        },
        subtaskOrder(root) {
            return dataSources.boardService.getSubtaskOrderOfTask(root.id)
        },
    },
}

module.exports = schema
