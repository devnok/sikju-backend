import { prisma } from "../../../lib"

export default{
    Query: {
        me: async (_, args, { request }) => request.user
    }
}