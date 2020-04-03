import './env';
import './lib';
import { GraphQLServer } from 'graphql-yoga';
import logger from 'morgan';
import schema from './schemas';
import './passport';
import { authenticateJwt } from './passport';
import { isAuthenticated, throwError } from './middlewares'
import { uploadController, uploadMiddleware, multiUploadMiddleware, multiUploadController } from './upload';

const port = process.env.PORT || 4000;

const server = new GraphQLServer({ schema, context: ({request, response}) =>  ({request, isAuthenticated, response, throwError}) });
server.express.use(logger("dev"));
server.express.use(authenticateJwt);
server.express.post('/api/upload', uploadMiddleware, uploadController);
server.express.post('/api/multiupload', multiUploadMiddleware, multiUploadController);

server.start({port}, () => {
    console.log(`✅  Server running on http://localhost:${port}`);
})