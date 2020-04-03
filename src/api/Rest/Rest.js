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
        couponInput: ({id}) => prisma.rest({id}).couponInput(),
        coupons: ({id}) => prisma.rest({id}).coupons(),
        reviews: ({id}) => prisma.rest({id}).reviews(),
        likeCount: ({id}) =>
            prisma
                .likesConnection({
                    where: { rest: { id } }
                })
                .aggregate()
                .count(),
        reviewCount: ({id}) =>
            prisma
                .reviewsConnection({
                    where: { rest: { id } }
                })
                .aggregate()
                .count()
    }
}