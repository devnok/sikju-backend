import { prisma } from "../../../lib";

export default {
    Mutation: {
        createEvent: (_, args, { request, isAuthenticated }) => {
            const { startAt, expireAt, thumbnail, url } = args;
            return prisma.event.create({
                data: {
                    thumbnail, url,
                    startAt: new Date(startAt),
                    expireAt: new Date(expireAt)
                }
            });
        }
    }
}