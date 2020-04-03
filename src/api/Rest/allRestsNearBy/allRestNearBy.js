import { rad2Deg, deg2Rad, EARTH_RADIUS_KM, lnlrange } from "../../../utils";
import { prisma } from "../../../../generated/prisma-client";

export default{
    Query: {
        allRestNearBy: (_, args) => {
            const { distance = 1.0, location } = args; // distance는 km단위
            console.log(args);

            const {
                maxLat, minLat, maxLon, minLon
            } = lnlrange(location, distance);
            return prisma.rests({
                where: {
                    location: {
                        AND: [
                            {
                              latitude_gte: minLat,
                              latitude_lte: maxLat,
                              longitude_gte: minLon,
                              longitude_lte: maxLon
                            }
                          ]
                    }
                }
            });
        }
    }
}