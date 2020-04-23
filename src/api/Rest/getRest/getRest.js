import { prisma } from "../../../lib";

export default {
    Query: {
        getRest: (_, { id }) => prisma.rest.findOne({ where: { id }})
    }
}