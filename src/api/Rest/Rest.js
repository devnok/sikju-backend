import { prisma } from "../../../generated/prisma-client";
import { coordsToAddress } from '../../utils';

export default {
    Rest: {
        location: ({id}) => prisma.rest({id}).location(),
        likes: ({id}) => prisma.rest({id}).likes(),
        files: ({id}) => prisma.rest({id}).files(),
        isLiked: ( {id}, _, { request }) => {
            const { user } = request;
            if(!user) return false;
            return prisma.$exists.like({
              AND: [
                {
                  user: { id: user.id }
                },
                {
                  rest: { id }
                }
              ]
            });
          },
        service: ({id}) => prisma.rest({id}).service(),
        coupons: ({id}) => prisma.rest({id}).coupons(),
        likeCount: ({id}) =>
            prisma
                .likesConnection({
                    where: { rest: { id } }
                })
                .aggregate()
                .count()
    }
}