import { prisma } from "../../../../generated/prisma-client";

export default{
    Mutation: {
        addReview: (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { restId, rating } = args;
            const { user } = request;

            return prisma.createReview({
                id: restId,
                rating
            })
        }
    }
}