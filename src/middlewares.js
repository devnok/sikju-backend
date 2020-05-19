export const isAuthenticated = req => {
    if (!req.user) {
        throw Error("로그인이 필요한 서비스입니다.");
    }
    return;
}
import { ApolloError } from 'apollo-server'
export const throwError = (msg, code) => {
    throw new ApolloError(msg, code);
}