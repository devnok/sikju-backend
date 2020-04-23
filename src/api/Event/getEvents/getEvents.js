import { prisma } from "../../../lib";

export default {
    Query: {
        getEvents: (_, args) => {
            const { page = 1, take = 40 } = args;
            return prisma.event.findMany({
                skip: take * (page - 1),
                first: take,
                orderBy: { createdAt: 'desc' }
            })
        }
    }
}