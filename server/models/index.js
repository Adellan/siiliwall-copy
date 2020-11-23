/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const dummyData = require('../dummyData')

const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(`${__dirname}/../config/config.js`)[env]
const db = {}

let sequelize
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config)
}

fs
    .readdirSync(__dirname)
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
        db[model.name] = model
    })

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

const initializeDb = async () => {
    try {
        await db.sequelize.sync({ force: true })
        await Promise.all(
            dummyData.users.map(async (user) => {
                const resolved = await db.User.create(user)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.projects.map(async (project) => {
                const resolved = await db.Project.create(project)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.boards.map(async (board) => {
                const resolved = await db.Board.create(board)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.columns.map(async (column) => {
                const resolved = await db.Column.create(column)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.stories.map(async (story) => {
                const resolved = await db.Story.create(story)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.userStories.map(async (userStory) => {
                const resolved = await db.UserStory.create(userStory)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.tasks.map(async (task) => {
                const resolved = await db.Task.create(task)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.colors.map(async (color) => {
                const resolved = await db.Color.create(color)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.usertasks.map(async (usertask) => {
                const resolved = await db.UserTask.create(usertask)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.colortasks.map(async (colortask) => {
                const resolved = await db.ColorTask.create(colortask)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.subtasks.map(async (subtask) => {
                const resolved = await db.Subtask.create(subtask)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.colorsubtasks.map(async (colorsubtask) => {
                const resolved = await db.ColorSubtask.create(colorsubtask)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.userSubtasks.map(async (userSubtask) => {
                const resolved = await db.UserSubtask.create(userSubtask)
                return resolved
            }),
        )
    } catch (e) {
        console.log(e)
    }
}

if (env === 'development') {
    initializeDb()
}

module.exports = db
