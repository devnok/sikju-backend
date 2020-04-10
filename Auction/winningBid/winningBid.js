import { prisma } from "../../../../generated/prisma-client";

export default{
    Mutation: {
        winningBid: (_, args) => {
            const { id } = args;
            const auction = prisma.bid({ id }).auction()
            const bid = prisma.$exists.bid({
                auction: { id: auction.id },
                win: true
            })
            if(bid){
                throw Error("이미 선택했습니다.")
            }
            return prisma.updateBid({
                data: { win: true },
                where: { id }
            })
        }
    }
}