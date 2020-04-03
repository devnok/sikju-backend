import { prisma } from "../../../../generated/prisma-client";

export default{
    Mutation: {
        createCoupon: async (_, { restId }, { request, isAuthenticated}) => {
            isAuthenticated(request);
            const { user } = request;
            const couponInput = await prisma.rest({id: restId}).couponInput()
            if(couponInput){
                return prisma.createCoupon({
                    ...couponInput,
                    id: null,
                    rest: {
                        connect: { id: restId }
                    },
                    user: {
                        connect: { id: user.id }
                    }
                })
            } else {
                throw Error('잘못된 요청입니다');
            }
        }
    }
}