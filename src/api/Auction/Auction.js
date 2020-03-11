import { prisma } from "../../../generated/prisma-client"

export default {
    Auction: {
        winningBid: async ({id}) => {
            const bids = await prisma.bids({
                auction: { id },
                win: true
            })
            if(bids.length > 0) return bids[0];
            else return null;
        }
    }
}