import { distance } from "../../../utils";
import { prisma } from "../../../../generated/prisma-client";

export default{
    Subscription: {
        newAuction: {
            subscribe: async (_, args) => {
                const { location } = args;
                return prisma.$subscribe
                    .auction({
                        AND: [
                            { mutation_in: "CREATED" },
                            {
                              node: {
                                location: {
                                    latitude_gte: minLat,
                                    latitude_lte: maxLat,
                                    longitude_gte: minLon,
                                    longitude_lte: maxLon
                                  }
                              }
                            }
                          ]
                    })
            },
            resolve: payload => payload
        }
    }
}