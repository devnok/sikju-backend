export const isAuthenticated = req => {
    if(!req.user){
        throw Error("You need to perform this action");
    }
    return;
}
import { ApolloError } from 'apollo-server'
export const throwError = (msg, code) => {
    throw new ApolloError(msg, code);
}