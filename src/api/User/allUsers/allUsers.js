import { prisma } from "../../../../generated/prisma-client";

export default {
    Query: {
        allUsers: (_, args) => prisma.users()
    }
}