import { prisma } from "../../../../generated/prisma-client";

export default {
    Query: {
        pastEvents: () => prisma.events({
            where: {
                expire_at_lte: Date.now()
            },
            orderBy: "start_at_ASC"
        })
    }
}