import { prisma } from "../../../../generated/prisma-client";

export default{
    Mutation: {
        createCoupon: async (_, { restId }, { request, isAuthenticated }) => {
            isAuthenticated(request);
            const { user } = request;
            const couponForm = prisma.rest({ id: restId }).service();
            const expireAt = new Date(Date.now() + couponForm.validTime * 3600 * 1000).toISOString()
            if(couponForm){
                return prisma.createCoupon({
                    form: {
                        connect: { id: couponForm.id }
                    },
                    user: {
                        connect: { id: user.id }
                    },
                    expireAt
                })
            } else {
                throw Error('잘못된 요청입니다');
            }
        }
    }
}