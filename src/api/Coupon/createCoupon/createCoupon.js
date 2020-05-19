import { prisma } from "../../../lib";

export default {
    Mutation: {
        createCoupon: async (_, { restId }, { request, isAuthenticated }) => {
            isAuthenticated(request);
            const { user } = request;
            const coupon = await prisma.coupon.findMany({
                first: 1,
                where: {
                    restId,
                    userId: user.id
                },
                orderBy: { createdAt: 'desc' }
            });
            if (coupon.length > 0 && new Date(coupon[0].createdAt).getTime() + 24 * 3600 * 1000 > new Date()) {
                throw Error('이미 발급되었습니다.')
            }
            const service = await prisma.service.findOne({ where: { restId } });
            if (service) {
                return prisma.coupon.create({
                    data: {
                        service: service.service,
                        desc: service.desc,
                        ...(service.warn && { warn: service.warn }),
                        rest: {
                            connect: { id: restId }
                        },
                        expireAt: new Date(Date.now() + service.validTime * 3600 * 1000),
                        user: {
                            connect: { id: user.id }
                        },
                    }
                })
            } else {
                throw Error('잘못된 요청입니다');
            }
        }
    }
}