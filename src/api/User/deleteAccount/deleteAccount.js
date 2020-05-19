import { prisma } from "../../../lib";

export default {
    Mutation: {
        deleteAccount: async (_, args, { request, isAuthenticated }) => {
            isAuthenticated(request);
            const { user } = request;
            try {
                const res = await prisma.raw(`DELETE FROM "User" WHERE id='${user.id}'`);
            } catch (e) {
                return false;
            }
            return true;
        }
    }
}