import { prisma } from "../../../../generated/prisma-client";

export default{
    Query: {
        me: (_, args, { request }) => {
            console.log(request.user);
            return request.user;
        }
    }
}