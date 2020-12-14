/* eslint-disable no-shadow */
/* eslint-disable radix */
/* eslint-disable class-methods-use-this */
const { v4: uuid } = require('uuid')

class BoardService {
    constructor({ db }) {
        this.store = db
        this.sequelize = db.sequelize
    }

    initialize() { }

    async getProjects() {
        let projectsFromDb
        try {
            projectsFromDb = await this.store.Project.findAll()
        } catch (e) {
            console.error(e)
        }
        return projectsFromDb
    }

    async getProjectById(projectId) {
        let projectFromDb
        try {
            projectFromDb = await this.store.Project.findByPk(projectId)
        } catch (e) {
            console.log(e)
        }
        return projectFromDb
    }

    async getBoardsByProjectId(projectId) {
        let boardsFromDb
        try {
            boardsFromDb = await this.store.Board.findAll({
                where: { projectId },
            })
        } catch (e) {
            console.error(e)
        }
        return boardsFromDb
    }

    async addProject(projectName) {
        let addedProject
        try {
            const largestOrderNumber = await this.store.Project.max('orderNumber')
            addedProject = await this.store.Project.create({
                id: uuid(),
                name: projectName,
                orderNumber: largestOrderNumber + 1,
            })
        } catch (e) {
            console.error(e)
        }
        return addedProject
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

    async deleteColumnById(id) {
        try {
            await this.store.Column.destroy({
                where: { id },
            })
        } catch (e) {
            console.error(e)
        }
        return id
    }

    async getStoriesByColumnId(columnId) {
        let storiesFromDb
        try {
            storiesFromDb = await this.store.Story.findAll({ where: { columnId, deletedAt: null } })
        } catch (e) {
            console.error(e)
        }
        return storiesFromDb
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
            subtasksFromDb = await this.store.Subtask.findAll(
                { where: { columnId, deletedAt: null } },
            )
        } catch (e) {
            console.error(e)
        }
        return subtasksFromDb
    }

    async getStoryById(storyId) {
        let storyFromDb
        try {
            storyFromDb = await this.store.Story.findByPk(storyId)
        } catch (e) {
            console.error(e)
        }
        return storyFromDb
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

    async getColorsByTaskId(taskId) {
        let rowsFromDb
        let colors
        try {
            rowsFromDb = await this.store.ColorTask.findAll({ where: { taskId }, attributes: ['colorId'] })
            const arrayOfIds = rowsFromDb.map((r) => r.dataValues.colorId)
            colors = await Promise.all(
                arrayOfIds.map(async (id) => {
                    const color = await this.store.Color.findByPk(id)
                    return color
                }),
            )
        } catch (e) {
            console.log(e)
        }
        return colors
    }

    async getColorsBySubtaskId(subtaskId) {
        let rowsFromDb
        let colors
        try {
            rowsFromDb = await this.store.ColorSubtask.findAll({ where: { subtaskId }, attributes: ['colorId'] })
            const arrayOfIds = rowsFromDb.map((r) => r.dataValues.colorId)
            colors = await Promise.all(
                arrayOfIds.map(async (id) => {
                    const color = await this.store.Color.findByPk(id)
                    return color
                }),
            )
        } catch (e) {
            console.log(e)
        }
        return colors
    }

    async getMembersByStoryId(storyId) {
        let rowsFromDb
        let members
        try {
            rowsFromDb = await this.store.UserStory.findAll({ where: { storyId }, attributes: ['userId'] })
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

    async editStoryById(storyId, title, size, ownerId, oldMemberIds, newMemberIds, description) {
        // Logic for figuring out who was deleted and who was added as a new member for the story
        const removedMemberIds = oldMemberIds.filter((id) => !newMemberIds.includes(id))
        const addedMembers = newMemberIds.filter((id) => !oldMemberIds.includes(id))
        let story
        try {
            story = await this.store.Story.findByPk(storyId)
            story.title = title
            story.size = size
            story.ownerId = ownerId
            story.description = description
            await story.save()
            // Updating userstories junction table
            await Promise.all(addedMembers.map(async (userId) => {
                await this.addMemberForStory(story.id, userId)
            }))
            await Promise.all(removedMemberIds.map(async (userId) => {
                await this.store.UserStory.destroy({
                    where: {
                        userId,
                        storyId: story.id,
                    },
                })
            }))
        } catch (e) {
            console.error(e)
        }
        return story
    }

    async editTaskById(taskId, title, size, ownerId, oldMemberIds, newMemberIds, oldColorIds, newColorIds, description) {
        // Logic for figuring out who was deleted and who was added as a new member for the task
        const removedMemberIds = oldMemberIds.filter((id) => !newMemberIds.includes(id))
        const addedMembers = newMemberIds.filter((id) => !oldMemberIds.includes(id))
        const removedColorIds = oldColorIds.filter((id) => !newColorIds.includes(id))
        const addedColors = newColorIds.filter((id) => !oldColorIds.includes(id))
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
            await Promise.all(addedColors.map(async (colorId) => {
                await this.addColorForTask(task.id, colorId)
            }))
            await Promise.all(removedColorIds.map(async (colorId) => {
                await this.store.ColorTask.destroy({
                    where: {
                        colorId,
                        taskId: task.id,
                    },
                })
            }))
        } catch (e) {
            console.error(e)
        }
        return task
    }

    async editSubtaskById(id, name, content, size, ownerId, oldMemberIds, newMemberIds, oldColorIds, newColorIds) {
        // Logic for figuring out who was deleted and who was added as a new member for the subtask
        const removedMemberIds = oldMemberIds.filter((id) => !newMemberIds.includes(id))
        const addedMembers = newMemberIds.filter((id) => !oldMemberIds.includes(id))
        const removedColorIds = oldColorIds.filter((id) => !newColorIds.includes(id))
        const addedColors = newColorIds.filter((id) => !oldColorIds.includes(id))
        let subtask
        try {
            subtask = await this.store.Subtask.findByPk(id)
            subtask.name = name
            subtask.content = content
            subtask.size = size
            subtask.ownerId = ownerId
            await subtask.save()
            // Updating userSubtasks junction table
            await Promise.all(addedMembers.map(async (userId) => {
                await this.addMemberForSubtask(subtask.id, userId)
            }))
            await Promise.all(removedMemberIds.map(async (userId) => {
                await this.store.UserSubtask.destroy({
                    where: {
                        userId,
                        subtaskId: subtask.id,
                    },
                })
            }))
            await Promise.all(addedColors.map(async (colorId) => {
                await this.addColorForSubtask(subtask.id, colorId)
            }))
            await Promise.all(removedColorIds.map(async (colorId) => {
                await this.store.ColorSubtask.destroy({
                    where: {
                        colorId,
                        subtaskId: subtask.id,
                    },
                })
            }))
        } catch (e) {
            console.error(e)
        }
        return subtask
    }

    async deleteStoryById(storyId) {
        try {
            await this.store.Story.destroy({
                where: { id: storyId },
            })
        } catch (e) {
            console.error(e)
        }
        return storyId
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
                    const copy = { ...obj }
                    delete copy.columnOrderNumber
                    return { ...copy }
                })
        } catch (e) {
            console.error(e)
        }
        return arrayOfObjectsInOrder
    }

    async addBoard(boardName, prettyId, color, projectId) {
        let addedBoard
        try {
            const largestOrderNumber = await this.store.Board.max('orderNumber', {
                where: { projectId },
            })
            addedBoard = await this.store.Board.create({
                id: uuid(),
                name: boardName,
                prettyId,
                color,
                orderNumber: largestOrderNumber + 1,
                projectId,
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

        const largestColumnOrderNumber = Math.max(
            largestColumnOrderNumberForTask,
            largestColumnOrderNumberForSubtask,
        )
        return largestColumnOrderNumber || 0
    }

    async findTheLargestSwimlaneOrderNumberOfBoard(boardId) {
        let largestSwimlaneOrderNumber
        try {
            largestSwimlaneOrderNumber = await this.store.Task.max('swimlaneOrderNumber', {
                where: {
                    boardId,
                },
            }) || 0
        } catch (e) {
            console.log(e)
        }
        return largestSwimlaneOrderNumber
    }

    async addStoryForColumn(boardId, columnId, title, size, ownerId, memberIds, description) {
        let addedStory
        try {
            // const storyBoard = await this.store.Board.findByPk(boardId)

            addedStory = await this.store.Story.create({
                id: uuid(),
                boardId,
                columnId,
                title,
                size,
                ownerId,
                memberIds,
                description,
            })
            await Promise.all(
                memberIds.map(async (memberId) => {
                    await this.addMemberForStory(addedStory.id, memberId)
                }),
            )
        } catch (e) {
            console.error(e)
        }
        return addedStory
    }

    async addTaskForColumn(boardId, columnId, title, size, ownerId, memberIds, colorIds, description) {
        /*
          At a new tasks' creation we want to display it as the lowermost task in its column,
          hence it is given the biggest columnOrderNumber of the column
          By default new task will be dirssplyed at the bottom of the swimlane view
        */
        let addedTask
        try {
            const largestOrderNumber = await this.findTheLargestOrderNumberOfColumn(columnId)
            const largestSwimlaneOrderNumber = await this.findTheLargestSwimlaneOrderNumberOfBoard(boardId)
            const tasksBoard = await this.store.Board.findByPk(boardId)
            const prettyIdOfBoard = tasksBoard.prettyId

            tasksBoard.ticketCount += 1
            const updatedBoard = await tasksBoard.save()

            addedTask = await this.store.Task.create({
                id: uuid(),
                prettyId: `${prettyIdOfBoard}-${updatedBoard.ticketCount}`,
                boardId,
                columnId,
                title,
                size,
                ownerId,
                description,
                columnOrderNumber: largestOrderNumber + 1,
                swimlaneOrderNumber: largestSwimlaneOrderNumber + 1,
            })
            await Promise.all(
                memberIds.map(async (memberId) => {
                    await this.addMemberForTask(addedTask.id, memberId)
                }),
            )
            await Promise.all(
                colorIds.map(async (colorId) => {
                    await this.addColorForTask(addedTask.id, colorId)
                }),
            )
        } catch (e) {
            console.error(e)
        }
        return addedTask
    }

    async addMemberForStory(storyId, userId) {
        let story
        try {
            await this.store.UserStory.create({
                userId,
                storyId,
            })
            story = await this.store.Story.findByPk(storyId)
        } catch (e) {
            console.error(e)
        }
        return story
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

    async addColorForTask(taskId, colorId) {
        let task
        try {
            await this.store.ColorTask.create({
                id: uuid(),
                colorId,
                taskId,
            })
            task = await this.store.Task.findByPk(taskId)
        } catch (e) {
            console.log(e)
        }
        return task
    }

    async addColorForSubtask(subtaskId, colorId) {
        let subtask
        try {
            await this.store.ColorSubtask.create({
                id: uuid(),
                colorId,
                subtaskId,
            })
            subtask = await this.store.Subtask.findByPk(subtaskId)
        } catch (e) {
            console.log(e)
        }
        return subtask
    }

    async addSubtaskForTask(
        taskId, columnId, boardId, name, content, size, ownerId, memberIds, colorIds, ticketOrder,
    ) {
        /*
          At the time of new subtask's creation we want to display it under its parent task
          hence we give it the columnOrderNumber one greater than the task's
          If subtask is created into diffenrent column than the current 'home' of parent task
          the subtask will be placed at the bottom of the column
        */
        let addedSubtask
        try {
            const subtasksBoard = await this.store.Board.findByPk(boardId)
            const prettyIdOfBoard = subtasksBoard.prettyId

            subtasksBoard.ticketCount += 1
            const updatedBoard = await subtasksBoard.save()

            addedSubtask = await this.store.Subtask.create({
                id: uuid(),
                prettyId: `${prettyIdOfBoard}-${updatedBoard.ticketCount}`,
                name,
                content,
                size,
                taskId,
                columnId,
                boardId,
                ownerId,
            })
            const parentTask = await this.store.Task.findByPk(taskId, { attributes: ['columnId'] })
            const newTicketOrder = Array.from(ticketOrder)
            // figure out if the created subtask was created into same column than its parent task
            // If so, give the added subtask an index one greater than the parent task's so that
            // subtask will appear under parent task
            if (columnId === parentTask.dataValues.columnId) {
                const indexOfParentTask = ticketOrder.findIndex((obj) => obj.ticketId === taskId)
                newTicketOrder.splice(indexOfParentTask + 1, 0, { ticketId: addedSubtask.id, type: 'subtask' })
            } else {
                newTicketOrder.push({ ticketId: addedSubtask.id, type: 'subtask' })
            }
            await this.reOrderTicketsOfColumn(newTicketOrder, columnId)
            await Promise.all(
                memberIds.map(async (memberId) => {
                    await this.addMemberForSubtask(addedSubtask.id, memberId)
                }),
            )
            await Promise.all(
                colorIds.map(async (colorId) => {
                    await this.addColorForSubtask(addedSubtask.id, colorId)
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

    async reOrderSwimlanes(swimlaneOrder) {
        try {
            await Promise.all(swimlaneOrder.map(async (id, index) => {
                const task = await this.store.Task.findByPk(id)
                task.swimlaneOrderNumber = index
                await task.save()
            }))
        } catch (e) {
            console.error(e)
        }
    }

    async getColors() {
        let colorsFromDb
        try {
            colorsFromDb = await this.store.Color.findAll()
        } catch (e) {
            console.log(e)
        }
        return colorsFromDb
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

    async getUsersByBoardId(boardId) {
        let projectId
        let usersFromProject
        try {
            const board = await this.store.Board.findByPk(boardId)
            projectId = board.projectId
            usersFromProject = await this.store.User.findAll({
                where: { projectId }
            })
        } catch (e) {
            console.error(e)
        }
        return usersFromProject
    }

    async addUser(userName) {
        let addedUser
        try {
            addedUser = await this.store.User.create({
                id: uuid(),
                userName,
            })
        } catch (e) {
            console.error(e)
        }
        return addedUser
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

    async archiveStoryById(storyId) {
        try {
            const story = await this.store.Story.findByPk(storyId)
            story.deletedAt = new Date()
            await story.save()
        } catch (e) {
            console.log(e)
        }
        return storyId
    }

    async restoreStoryById(storyId) {
        let updatedStory
        try {
            const story = await this.store.Story.findByPk(storyId)
            story.deletedAt = null
            updatedStory = await story.save()
        } catch (e) {
            console.log(e)
        }
        return updatedStory
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

    async getSwimlaneOrderOfBoard(boardId) {
        let swimlaneOrder
        try {
            swimlaneOrder = await this.store.Task.findAll({
                attributes: ['id'],
                where: { boardId, deletedAt: null },
                order: this.sequelize.literal('swimlaneOrderNumber ASC'),
            })
            swimlaneOrder = swimlaneOrder.map((item) => item.dataValues.id)
        } catch (e) {
            console.log(e)
        }
        return swimlaneOrder
    }

    async updateSwimlaneOrderNumbers(boardId, newSwimlaneOrder) {
        try {
            await Promise.all(newSwimlaneOrder.map(async (obj) => {
                const task = await this.store.Task.findByPk(obj.id)
                task.swimlaneOrderNumber = obj.swimlaneOrderNumber
                await task.save()
            }))
        } catch (e) {
            console.log(e)
        }
        return boardId
    }
}

module.exports.BoardService = BoardService
