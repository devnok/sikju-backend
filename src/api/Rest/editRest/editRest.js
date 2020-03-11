import { prisma } from "../../../../generated/prisma-client";

export default {
    Mutation: {
        editRest: async (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id, name, info, phone, location } = args;
            const { user } = request;
            const ruser = await prisma.user({ id: user.id }).restUser()
            const rest = await prisma.$exists.post({ id, restUser: { id: ruser.id } });
            if(rest){
                prisma.updateRest({
                    data: {
                        name,info,phone,
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