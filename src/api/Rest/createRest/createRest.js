import { prisma } from "../../../lib";

export default{
    Mutation: {
        createRest: (_, args) => {
            const { name, desc, phone, thumbnail, location } = args;
            return prisma.rest.create({
                data: {
                    name, desc, phone, thumbnail,
                    location: {
                        create: location
                    }
                }
            })
        }
    }
}