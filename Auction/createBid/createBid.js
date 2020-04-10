import { prisma } from "../../../../generated/prisma-client";

export default{
    Mutation: {
        createBid: async (_, args, {request, isAuthenticated}) => {
            isAuthenticated(request);
            const { auction_id, service } = args;
            const { id } = request.user;
            const restUser = await prisma.user({ id }).restUser();
            let bid;
            if(restUser){
                bid = await prisma.createBid({
                    service,
                    auction: {
                        connect: {
                            id: auction_id
                        }
                    },
                    restUser: {
                        connect: {
                            id: restUser.id
                        }
                    }
                })
            } else {
                throw Error("등록되지 않은 사용자 입니다.")
            }
            return bid;
        }
    }
}