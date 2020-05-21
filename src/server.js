import './env';
import './lib';
import { GraphQLServer } from 'graphql-yoga';
import schema from './schemas';
import './passport';
import { authenticateJwt } from './passport';
import { isAuthenticated } from './middlewares'
import { uploadController, uploadMiddleware, multiUploadMiddleware, multiUploadController } from './upload';

const port = process.env.PORT || 4000;
const options = {
    port
}

const server = new GraphQLServer({ schema, context: ({ request, response }) => ({ request, isAuthenticated, response }) });

server.express.use(authenticateJwt);

server.express.post('/api/upload/single', uploadMiddleware, uploadController);
server.express.post('/api/upload/multi', multiUploadMiddleware, multiUploadController);

server.start(options, ({ port }) => {
    console.log(`✅  Server running on http://localhost:${port}`);
})