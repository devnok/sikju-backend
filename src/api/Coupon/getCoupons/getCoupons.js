import { prisma } from "../../../lib";

export default {
    Query: {
        getCoupons: (_,args,{request, isAuthenticated}) => {
            isAuthenticated(request);
            return prisma.coupon.findMany({
                where: { userId: request.user.id },
                include: {
                    rest: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        }
    }
}