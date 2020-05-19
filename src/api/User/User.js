import { prisma } from "../../lib";

export default {
    User: {
        likes: ({ id }) => prisma.like.findMany({ where: { userId: id } }),
        coupons: ({ id }) => prisma.coupon.findMany({ where: { userId: id } }),
        couponCount: ({ id }) => prisma.coupon.count({ where: { userId: id } }),
        profile: ({ id }) => prisma.profile.findOne({ where: { userId: id } }),
        notifications: ({ id }) => prisma.user.findOne({ where: { id } }).notifications()
    }
}