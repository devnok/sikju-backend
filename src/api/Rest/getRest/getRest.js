import { prisma } from "../../../../generated/prisma-client";

export default {
    Query: {
        getRest: (_,args) => {
            const { restId } =  args;
            return prisma.rest({ id: restId });
        }
    }
}