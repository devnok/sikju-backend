import { prisma } from "../../../../generated/prisma-client";

export default{
    Query: {
        usernameExist: async (_, args) => {
            const { username } = args;
            const exists = await prisma.$exists.user({ username });
            if (exists) {
                return true;
            }
            return false;
        }
    }
}