import { prisma } from "../../../lib";

export default{
    Mutation: {
        createCoupon: async (_, { restId }, { request, isAuthenticated }) => {
            isAuthenticated(request);
            const { user } = request;
            const service = await prisma.service.findOne({ where: { restId }});
            if(service){
                return prisma.coupon.create({
                    data: {
                        service: service.service,
                        desc: service.desc,
                        warn: service.warn,
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