import { prisma } from "../../../lib";

export default {
    Mutation: {
        createNotice: (_, args, { request, isAuthenticated }) => {
            isAuthenticated(request);
            return prisma.notice.create({ data: args });
        }
    }
}