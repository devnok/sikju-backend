import { prisma } from "../../../lib";

export default {
  Mutation: {
    toggleLike: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { restId } = args;
      const { user } = request;
      const filterOptions = {
        where: {
          restId_userId: {
            restId,
            userId: user.id
          }
        }
      }
      try {
        const existingLike = await prisma.like.findOne(filterOptions);
        if (existingLike) {
          await prisma.like.delete(filterOptions);
        } else {
          const like = await prisma.like.create({
            data: {
              user: {
                connect: { id: user.id }
              },
              rest: {
                connect: { id: restId }
              }
            }
          });
        }
        return true;
      } catch(e) {
        console.log(e);
        return false;
      }
    }
  }
};