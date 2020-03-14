import './env';
import './lib';
import { GraphQLServer } from 'graphql-yoga';
import logger from 'morgan';
import schema from './schemas';
import './passport';
import { authenticateJwt } from './passport';
import { isAuthenticated } from './middlewares'

const port = process.env.PORT || 4000;

const server = new GraphQLServer({ schema, context: ({request, response}) =>  ({request, isAuthenticated, response}) });
server.express.use(logger("dev"));
server.express.use(authenticateJwt);

server.start({port}, () => {
    console.log(`✅  Server running on http://localhost:${port}`);
})