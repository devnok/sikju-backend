import { prisma } from "../../../../generated/prisma-client";

export default {
    Query: {
        onGoingEvents: async () => {
        const events = await prisma.events({
            where: {
                AND: [
                    { startAt_lte: new Date().toISOString() },
                    { expireAt_gt: new Date().toISOString() }
                ]
            }
        })
        console.log(events.length);
        return events;
        }
    }
}