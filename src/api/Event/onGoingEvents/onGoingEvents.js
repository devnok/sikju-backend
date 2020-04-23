import { prisma } from "../../../lib";

export default {
    Query: {
        onGoingEvents: async () => {
            const events = await prisma.raw`select * from "Event" WHERE "expireAt" > now()`
            return events;
        }
    }
}