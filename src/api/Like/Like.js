import { prisma } from "../../../generated/prisma-client";

export default {
  Like: {
    rest: ({ id }) => prisma.like({ id }).rest(),
    user: ({ id }) => prisma.like({ id }).user()
  }
};