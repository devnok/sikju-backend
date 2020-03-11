import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation: {
        createAuction: async (_,args,{request, isAuthenticated }) => {
            isAuthenticated(request);
            const { n, text = "", location } = args;
            const { id } = request.user;
            const auction = await prisma.createAuction({
                n, text,
                location: {
                    create: location
                },
                owner: {
                    connect: {
                        id
                    }
                }
            });
            return auction;
        }
    }
}