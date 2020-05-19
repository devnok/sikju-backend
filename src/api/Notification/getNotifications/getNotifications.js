import { prisma } from "../../../lib";

export default {
    Query: {
        getNotifications: (_, args, { request, isAuthenticated }) => {
            isAuthenticated(request);
            const { user } = request;

            const { page = 1, take = 40 } = args;
            return prisma.notification.findMany(
                {
                    skip: take * (page - 1),
                    first: take,
                    orderBy: { id: 'desc' },
                    where: { users: { some: { id: user.id } } }
                }
            )
        }
    }
}