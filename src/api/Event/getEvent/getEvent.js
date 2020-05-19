import { prisma } from "../../../lib";

export default {
    Query: {
        getEvent: (_, { id }) => prisma.event.findOne({
            where: { id }
        })
    }
}