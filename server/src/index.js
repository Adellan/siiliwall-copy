const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const { ApolloServer } = require('apollo-server-express')
const http = require('http')
const { makeExecutableSchema } = require('graphql-tools')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const config = require('./utils/config')
const typeDefs = require('./graphql/typedefs')
const resolvers = require('./graphql/resolvers')

const schema = makeExecutableSchema({ typeDefs, resolvers })
app.use('/graphql', bodyParser.json())
app.use('/health', require('express-healthcheck')())

const apollo = new ApolloServer({ schema })
apollo.applyMiddleware({ app, path: '/graphql' })

const server = http.createServer(app)
apollo.installSubscriptionHandlers(app)

server.listen({ port: config.PORT }, () => {
    console.log(`Server running on port ${config.PORT}`)
    // eslint-disable-next-line no-new
    /* new SubscriptionServer({
        execute,
        subscribe,
        schema,
    }, {
        server,
        path: '/graphql',
    }) */
})

const closeHttpServer = () => {
    server.close()
}

module.exports = { app, closeHttpServer }
