import { prisma } from "../../../lib";

export default {
  Mutation: {
    toggleNotified: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      return prisma.user.update({
        where: { id: user.id },
        data: { notified: !user.notified }
      })
    }
  }
}