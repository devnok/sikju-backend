import { prisma } from "../../../../generated/prisma-client";

export default {
    Query: {
        viewRest: (_,args) => {
            const { restId } =  args;
            return prisma.rest({ id: restId });
        }
    }
}