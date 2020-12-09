const { users } = require('../../../dummyData')
const dataSources = require('../../datasources')

const schema = {
    Query: {
        projectById(root, args) {
            return dataSources.boardService.getProjectById(args.id)
        },
        boardsByProjectId(root, args) {
            return dataSources.boardService.getBoardsByProjectId(args.id)
        },
        allProjects() {
            return dataSources.boardService.getProjects()
        }
    },
    Mutation: {
        async addProject(root, { name }) {
            return dataSources.boardService.addProject(name)
        },
    },
    Project: {
        boards(root) {
            return dataSources.boardService.getBoardsByProjectId(root.id)
        },
    }
}
module.exports = schema