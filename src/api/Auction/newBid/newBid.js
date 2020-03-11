import { prisma } from "../../../../generated/prisma-client";

export default {
    Subscription: {
        newBid: {
            subscribe: (_, args) => {
                const { auctionId } = args;
                return prisma.$subscribe
                    .bid({
                        AND: [
                        { mutation_in: "CREATED" },
                        {
                            node: {
                                auction: { id: auctionId }
                            }
                        }
                        ]
                    })
                    .node();
            },
            resolve: payload => payload
        }
    }
}