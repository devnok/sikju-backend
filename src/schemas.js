import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';

const allTypes = fileLoader(path.join(__dirname, "/api/**/*.graphql"))
const allResolvers = fileLoader(path.join(__dirname, "/api/**/*.js"))

const schemas = makeExecutableSchema({
    typeDefs: mergeTypes(allTypes),
    resolvers: mergeResolvers(allResolvers)
});

export default schemas;
