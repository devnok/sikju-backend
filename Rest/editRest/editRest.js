import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation: {
        editRest: async (_, args, {request, isAuthenticated}) => {
            const { id, name, info, phone, location, files } = args;
            const rest = await prisma.$exists.rest({ id });
            if(rest){
                return prisma.updateRest({
                    data: {
                        name,info,phone,files,
                        location: {
                            create: location
                        }
                    },
                    where: { id }
                });
            } else {
                throw Error("You cannot do that.");
            }
        }
    }
}