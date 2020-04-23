import { prisma } from "../../lib";

export default{
    Like: {
        rest: ({restId}) => prisma.rest.findOne({ where: { id: restId }})
    }
}