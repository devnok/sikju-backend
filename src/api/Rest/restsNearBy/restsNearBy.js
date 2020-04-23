import { lnlrange } from "../../../utils";
import { prisma } from "../../../lib";

export default{
    Query: {
        restsNearBy: (_, args) => {
            const { distance = 1000, location: {longitude, latitude} } = args;
            const point = `${latitude},${longitude}`;
            return prisma.raw(
                `select
                    *, earth_distance(ll_to_earth(latitude,longitude), ll_to_earth(${point})) AS distance
                    FROM "Rest"
                    INNER JOIN "Location" ON "restId" = "id"
                    WHERE earth_distance(ll_to_earth(latitude,longitude), ll_to_earth(${point})) <= 6000`);
        }
    }
}