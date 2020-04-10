import { prisma } from "../../../../generated/prisma-client";

export default{
    Query: {
        usernameExist: async (_, args) => {
            const { nickname } = args;
            const exists = await prisma.$exists.user({ nickname });
            if (exists) {
                return true;
            }
            return false;
        }
    }
}