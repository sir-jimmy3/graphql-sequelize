const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express =  require('express');
const { sequelize } = require('./models');
const http = require('http');
const path = require('path');
const jwt = require('jsonwebtoken');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const data = require('./headers.json');

require('dotenv').config();

const {JWT_SECRET, PORT} = process.env;

const typesArray = loadFilesSync(path.join(__dirname, './schema'));
const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'));

const typeDefs = mergeTypeDefs(typesArray);
const resolvers = mergeResolvers(resolversArray);

const getUser = token => {
    try {
        if (token) {
            return jwt.verify(token, JWT_SECRET);
        }
    } catch (err) {
        return null;
    }
}

async function startApolloServer(typeDefs, resolvers) {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        context: ({ res,req }) => {
                const token = req.get('Authorization') || '';
                return {
                    user: getUser(token.replace('Bearer', '')),
                    res
                };
        }
    });
    await server.start();
    await sequelize.sync();
    server.applyMiddleware({ app, cors: {
            credentials: true,
            origin: true,
            exposedHeaders: data.headers,
        }});
    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve))
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers).then(() => console.log('Success'));