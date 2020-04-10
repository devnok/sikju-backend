import { prisma } from "../../../generated/prisma-client";

export default {
  Review: {
    user: ({ id }) => prisma.review({ id }).user(),
    rest: ({ id }) => prisma.review({ id }).rest()
  }
};