import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    toggleLike: async (_, args, { request }) => {
      isAuthenticated(request);
      const { restId } = args;
      const { user } = request;
      const filterOptions = {
        AND: [
          {
            user: { id: user.id }
          },
          {
            rest: { id: restId }
          }
        ]
      };
      try {
        const existingLike = await prisma.$exists.like(filterOptions);
        if (existingLike) {
          await prisma.deleteManyLikes(filterOptions);
        } else {
          await prisma.createLike({
            user: {
              connect: {
                id: user.id
              }
            },
            rest: {
              connect: {
                id: restId
              }
            }
          });
        }
        return true;
      } catch {
        return false;
      }
    }
  }
};