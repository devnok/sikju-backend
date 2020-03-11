import { prisma } from "../../../../generated/prisma-client";

export default{
    Mutation: {
        createRest: (_, args,{request, isAuthenticated}) => {
            isAuthenticated(request);
            const { id } = request.user;
            const { name, info = "", phone, location } = args;
            const rerstUserForm = {
                create: {
                    user: { connect: { id }}
                }
            }
            return prisma.createRest({
                name, info, phone,
                location: {
                    create: location
                },
                restUser: rerstUserForm
            });
        }
    }
}