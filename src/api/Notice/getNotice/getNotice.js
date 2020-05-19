import { prisma } from "../../../lib";

export default {
    Query: {
        getNotice: (_, { id }) => prisma.notice.findOne({
            where: { id }
        })
    }
}