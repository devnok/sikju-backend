import { prisma } from "../../lib";

export default {
  Rest: {
    location: ({ id }) => prisma.location.findOne({ where: { restId: id } }),
    likes: ({ id }) => prisma.like.findMany({ where: { restId: id } }),
    files: ({ id }) => prisma.file.findMany({ where: { restId: id } }),
    isLiked: async ({ id }, _, { request }) => {
      const { user } = request;
      if (!user) return false;
      const like = await prisma.like.findOne({
        where: {
          restId_userId: {
            userId: user.id,
            restId: id
          }
        }
      });
      return !!like;
    },
    service: ({ id }) => prisma.service.findOne({ where: { restId: id } }),
    coupons: ({ id }) => prisma.coupon.findMany({ where: { restId: id } }),
    likeCount: ({ id }) => prisma.like.count({ where: { restId: id } })
  }
}