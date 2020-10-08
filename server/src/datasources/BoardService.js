/* eslint-disable class-methods-use-this */
/* eslint-disable max-len */
const { v4: uuid } = require('uuid')

class BoardService {
    constructor({ db }) {
        this.store = db
        this.sequelize = db.sequelize
    }

    initialize() { }

    async getBoards() {
        let boardsFromDb
        try {
            boardsFromDb = await this.store.Board.findAll()
        } catch (e) {
            console.error(e)
        }
        return boardsFromDb
    }

    async getBoardById(boardId) {
        let boardFromDb
        try {
            boardFromDb = await this.store.Board.findByPk(boardId)
        } catch (e) {
            console.error(e)
        }
        return boardFromDb
    }

    async getColumnsByBoardId(boardId) {
        let columnsByBoardIdFromDb
        try {
            columnsByBoardIdFromDb = await this.store.Column.findAll({ where: { boardId } })
        } catch (e) {
            console.error(e)
        }
        return columnsByBoardIdFromDb
    }

    async getColumnBoardByColumnId(columnId) {
        let boardFromDb
        try {
            const columnFromDb = await this.store.Column.findByPk(columnId)
            boardFromDb = await this.store.Board.findByPk(columnFromDb.boardId)
        } catch (e) {
            console.error(e)
        }
        return boardFromDb
    }

    async getColumnById(columnId) {
        let columnFromDb
        try {
            columnFromDb = await this.store.Column.findByPk(columnId)
        } catch (e) {
            console.error(e)
        }
        return columnFromDb
    }

    async editColumnById(columnId, name) {
        let column
        try {
            column = await this.store.Column.findByPk(columnId)
            column.name = name
            await column.save()
        } catch (e) {
            console.error(e)
        }
        return column
    }

    async deleteColumnById(columnId) {
        try {
            await this.store.Column.destroy({
                where: { id: columnId },
            })
        } catch (e) {
            console.error(e)
        }
        return columnId
    }

    async getTasksByColumnId(columnId) {
        let tasksFromDb
        try {
            tasksFromDb = await this.store.Task.findAll({ where: { columnId, deletedAt: null } })
        } catch (e) {
            console.error(e)
        }
        return tasksFromDb
    }

    async getSubtasksByColumnId(columnId) {
        let subtasksFromDb
        try {
            subtasksFromDb = await this.store.Subtask.findAll({ where: { columnId, deletedAt: null } })
        } catch (e) {
            console.error(e)
        }
        return subtasksFromDb
    }

    async getTaskById(taskId) {
        let taskFromDb
        try {
            taskFromDb = await this.store.Task.findByPk(taskId)
        } catch (e) {
            console.error(e)
        }
        return taskFromDb
    }

    async getUserById(userId) {
        let userFromDb
        try {
            userFromDb = await this.store.User.findByPk(userId)
        } catch (e) {
            console.log(e)
        }
        return userFromDb
    }

    async getSubtasksByTaskId(taskId) {
        let subtasksFromDb
        try {
            subtasksFromDb = await this.store.Subtask.findAll({ where: { taskId } })
        } catch (e) {
            console.error(e)
        }
        return subtasksFromDb
    }

    async getMembersByTaskId(taskId) {
        let rowsFromDb
        let members
        try {
            rowsFromDb = await this.store.UserTask.findAll({ where: { taskId }, attributes: ['userId'] })
            const arrayOfIds = rowsFromDb.map((r) => r.dataValues.userId)
            members = await Promise.all(
                arrayOfIds.map(async (id) => {
                    const user = await this.store.User.findByPk(id)
                    return user
                }),
            )
        } catch (e) {
            console.error(e)
        }
        return members
    }

    async getMembersBySubtaskId(subtaskId) {
        let rowsFromDb
        let members
        try {
            rowsFromDb = await this.store.UserSubtask.findAll({ where: { subtaskId }, attributes: ['userId'] })
            const arrayOfIds = rowsFromDb.map((r) => r.dataValues.userId)
            members = await Promise.all(
                arrayOfIds.map(async (id) => {
                    const user = await this.store.User.findByPk(id)
                    return user
                }),
            )
        } catch (e) {
            console.error(e)
        }
        return members
    }

    async editTaskById(taskId, title, size, ownerId, oldMemberIds, newMemberIds, description) {
        // Logic for figuring out who was deleted and who was added as a new member for the task
        const removedMemberIds = oldMemberIds.filter((id) => !newMemberIds.includes(id))
        const addedMembers = newMemberIds.filter((id) => !oldMemberIds.includes(id))
        let task
        try {
            task = await this.store.Task.findByPk(taskId)
            task.title = title
            task.size = size
            task.ownerId = ownerId
            task.description = description
            await task.save()
            // Updating usertasks junction table
            await Promise.all(addedMembers.map(async (userId) => {
                await this.addMemberForTask(task.id, userId)
            }))
            await Promise.all(removedMemberIds.map(async (userId) => {
                await this.store.UserTask.destroy({
                    where: {
                        userId,
                        taskId: task.id,
                    },
                })
            }))
        } catch (e) {
            console.error(e)
        }
        return task
    }

    async deleteTaskById(taskId) {
        try {
            await this.store.Task.destroy({
                where: { id: taskId },
            })
        } catch (e) {
            console.error(e)
        }
        return taskId
    }

    /*
    Gets the order of columns in certain board, returns an array of columnIds in the correct order.
    This field is for keeping track of the order in which the columns are displayed in the board
  */
    async getColumnOrderOfBoard(boardId) {
        let arrayOfIds
        try {
            const columns = await this.store.Column.findAll({
                attributes: ['id'],
                where: { boardId },
                order: this.sequelize.literal('orderNumber ASC'),
            })
            arrayOfIds = columns.map((column) => column.dataValues.id)
        } catch (e) {
            console.error(e)
        }
        return arrayOfIds
    }

    /*
    Gets the order of tasks in certain column, returns an array of taskIds in the correct order.
    This field is for keeping track of the order in which the tasks are displayed in the column
  */
    async getTaskOrderOfColumn(columnId) {
        let arrayOfIds
        try {
            const tasks = await this.store.Task.findAll({
                attributes: ['id'],
                where: { columnId, deletedAt: null },
                order: this.sequelize.literal('columnOrderNumber ASC'),
            })
            arrayOfIds = tasks.map((task) => task.dataValues.id)
        } catch (e) {
            console.error(e)
        }
        return arrayOfIds
    }

    async getSubtaskOrderOfColumn(columnId) {
        let arrayOfIds
        try {
            const subtasks = await this.store.Subtask.findAll({
                attributes: ['id'],
                where: { columnId, deletedAt: null },
                order: this.sequelize.literal('columnOrderNumber ASC'),
            })
            arrayOfIds = subtasks.map((task) => task.dataValues.id)
        } catch (e) {
            console.error(e)
        }
        return arrayOfIds
    }

    async getTicketOrderOfColumn(columnId) {
        let arrayOfObjectsInOrder
        // TODO: Figure out if this could be done better
        try {
            const subtasks = await this.store.Subtask.findAll({
                attributes: ['id', 'columnOrderNumber'],
                where: { columnId, deletedAt: null },
            })
            const arrayOfSubtaskObjects = subtasks.map((subtask) => ({ ticketId: subtask.dataValues.id, type: 'subtask', columnOrderNumber: subtask.dataValues.columnOrderNumber }))

            const tasksFromDb = await this.store.Task.findAll({
                attributes: ['id', 'columnOrderNumber'],
                where: { columnId, deletedAt: null },
            })
            const arrayOfTaskObjects = tasksFromDb.map((task) => ({ ticketId: task.dataValues.id, type: 'task', columnOrderNumber: task.dataValues.columnOrderNumber }))

            arrayOfObjectsInOrder = arrayOfTaskObjects.concat(arrayOfSubtaskObjects)
                .sort((a, b) => a.columnOrderNumber - b.columnOrderNumber)
                .map((obj) => {
                    delete obj.columnOrderNumber
                    return { ...obj }
                })
        } catch (e) {
            console.error(e)
        }
        return arrayOfObjectsInOrder
    }

    async getSubtaskOrderOfTask(taskId) {
        let arrayOfIds
        try {
            const subtasks = await this.store.Subtask.findAll({
                attributes: ['id'],
                where: { taskId },
                order: this.sequelize.literal('orderNumber ASC'),
            })
            arrayOfIds = subtasks.map((subtask) => subtask.dataValues.id)
        } catch (e) {
            console.error(e)
        }
        return arrayOfIds
    }

    async addBoard(boardName) {
        let addedBoard
        try {
            const largestOrderNumber = await this.store.Board.max('orderNumber')
            addedBoard = await this.store.Board.create({
                id: uuid(),
                name: boardName,
                orderNumber: largestOrderNumber + 1,
            })
        } catch (e) {
            console.error(e)
        }
        return addedBoard
    }

    async addColumnForBoard(boardId, columnName) {
        /*
          At the time of new columns' creation we want to display it as
          the component in the very right of the board,
          hence it is given the biggest orderNumber of the board
        */
        let addedColumn
        try {
            const largestOrderNumber = await this.store.Column.max('orderNumber', {
                where: { boardId },
            })
            addedColumn = await this.store.Column.create({
                id: uuid(),
                boardId,
                name: columnName,
                orderNumber: largestOrderNumber + 1,
            })
        } catch (e) {
            console.error(e)
        }
        return addedColumn
    }

    async findTheLargestOrderNumberOfColumn(columnId) {
        let largestColumnOrderNumberForTask
        let largestColumnOrderNumberForSubtask
        try {
            largestColumnOrderNumberForTask = await this.store.Task.max('columnOrderNumber', {
                where: {
                    columnId,
                },
            }) || 0
            largestColumnOrderNumberForSubtask = await this.store.Subtask.max('columnOrderNumber', {
                where: {
                    columnId,
                },
            }) || 0
        } catch (e) {
            console.error(e)
        }

        const largestColumnOrderNumber = Math.max(largestColumnOrderNumberForTask, largestColumnOrderNumberForSubtask)
        return largestColumnOrderNumber || 0
    }

    async addTaskForColumn(columnId, title, size, ownerId, memberIds, description) {
        /*
          At the time of new tasks' creation we want to display it as the lower most task in its column,
          hence it is given the biggest columnOrderNumber of the column
        */
        let addedTask
        try {
            const largestOrderNumber = await this.findTheLargestOrderNumberOfColumn(columnId)
            addedTask = await this.store.Task.create({
                id: uuid(),
                columnId,
                title,
                size,
                ownerId,
                description,
                columnOrderNumber: largestOrderNumber + 1,
            })
            await Promise.all(
                memberIds.map(async (memberId) => {
                    await this.addMemberForTask(addedTask.id, memberId)
                }),
            )
        } catch (e) {
            console.error(e)
        }
        return addedTask
    }

    async addMemberForTask(taskId, userId) {
        let task
        try {
            await this.store.UserTask.create({
                userId,
                taskId,
            })
            task = await this.store.Task.findByPk(taskId)
        } catch (e) {
            console.error(e)
        }
        return task
    }

    async addMemberForSubtask(subtaskId, userId) {
        let subtask
        try {
            await this.store.UserSubtask.create({
                userId,
                subtaskId,
            })
            subtask = await this.store.Subtask.findByPk(subtaskId)
        } catch (e) {
            console.error(e)
        }
        return subtask
    }

    async addSubtaskForTask(taskId, columnId, content, ownerId, memberIds, ticketOrder) {
        /*
          At the time of new subtask's creation we want to display it under its parent task
          hence we give it the columnOrderNumber one greater than the task's
        */
        let addedSubtask
        try {
            addedSubtask = await this.store.Subtask.create({
                id: uuid(),
                content,
                taskId,
                columnId,
                ownerId,
            })
            const newTicketOrder = Array.from(ticketOrder)
            const indexOfParentTask = ticketOrder.findIndex((obj) => obj.ticketId === taskId)
            newTicketOrder.splice(indexOfParentTask + 1, 0, { ticketId: addedSubtask.id, type: 'subtask' })
            await this.reOrderTicketsOfColumn(newTicketOrder, columnId)
            await Promise.all(
                memberIds.map(async (memberId) => {
                    await this.addMemberForSubtask(addedSubtask.id, memberId)
                }),
            )
        } catch (e) {
            console.error(e)
        }
        return addedSubtask
    }

    async deleteSubtaskById(subtaskId) {
        try {
            await this.store.Subtask.destroy({
                where: { id: subtaskId },
            })
        } catch (e) {
            console.error(e)
        }
        return subtaskId
    }

    async archiveSubtaskById(subtaskId) {
        try {
            const subtask = await this.store.Subtask.findByPk(subtaskId)
            subtask.deletedAt = new Date()
            await subtask.save()
        } catch (e) {
            console.error(e)
        }
        return subtaskId
    }

    // Loop through tasks and set the new columnOrderNumber for each using the index of the array
    async reOrderTasksOfColumn(newOrderArray, columnId) {
        let column
        try {
            await Promise.all(newOrderArray.map(async (id, index) => {
                const task = await this.store.Task.findByPk(id)
                task.columnOrderNumber = index
                await task.save()
            }))
            column = await this.store.Column.findByPk(columnId)
        } catch (e) {
            console.log(e)
        }
        return column
    }

    async reOrderTicketsOfColumn(newOrderArray, columnId) {
        let column
        try {
            await Promise.all(newOrderArray.map(async (obj, index) => {
                if (obj.type === 'task') {
                    const task = await this.store.Task.findByPk(obj.ticketId)
                    task.columnOrderNumber = index
                    await task.save()
                } else if (obj.type === 'subtask') {
                    const subtask = await this.store.Subtask.findByPk(obj.ticketId)
                    subtask.columnOrderNumber = index
                    await subtask.save()
                }
            }))
            column = await this.store.Column.findByPk(columnId)
        } catch (e) {
            console.log(e)
        }
        return column
    }

    async changeTasksColumnId(taskId, columnId) {
        try {
            const task = await this.store.Task.findByPk(taskId)
            task.columnId = columnId
            await task.save()
        } catch (e) {
            console.error(e)
        }
    }

    async changeSubtasksColumnId(subtaskId, columnId) {
        try {
            const subtask = await this.store.Subtask.findByPk(subtaskId)
            subtask.columnId = columnId
            await subtask.save()
        } catch (e) {
            console.error(e)
        }
    }

    async changeTicketsColumnId(type, ticketId, columnId) {
        if (type === 'task') {
            await this.changeTasksColumnId(ticketId, columnId)
        } else if (type === 'subtask') {
            await this.changeSubtasksColumnId(ticketId, columnId)
        }
    }

    async reOrderColumns(columnOrder) {
        try {
            await Promise.all(columnOrder.map(async (id, index) => {
                const column = await this.store.Column.findByPk(id)
                column.orderNumber = index
                await column.save()
            }))
        } catch (e) {
            console.log(e)
        }
    }

    async getUsers() {
        let usersFromDb
        try {
            usersFromDb = await this.store.User.findAll()
        } catch (e) {
            console.error(e)
        }
        return usersFromDb
    }

    async getOwnerById(ownerId) {
        let owner
        try {
            owner = await this.store.User.findByPk(ownerId)
        } catch (e) {
            console.log(e)
        }
        return owner
    }

    async archiveTaskById(taskId) {
        try {
            const task = await this.store.Task.findByPk(taskId)
            task.deletedAt = new Date()
            await task.save()
        } catch (e) {
            console.log(e)
        }
        return taskId
    }

    async restoreTaskById(taskId) {
        let updatedTask
        try {
            const task = await this.store.Task.findByPk(taskId)
            task.deletedAt = null
            updatedTask = await task.save()
        } catch (e) {
            console.log(e)
        }
        return updatedTask
    }
}

module.exports.BoardService = BoardService
