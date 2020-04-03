import { prisma } from "../../../../generated/prisma-client";

export default {
    Query: {
        onGoingEvents: () => prisma.events({
            where: {
                AND: [
                    { start_at_lte: new Date().toISOString() },
                    { expire_at_gt: new Date().toISOString() }
                ]
            },
            orderBy: "start_at_ASC"
        })
    }
}