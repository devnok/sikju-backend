import { prisma } from "../../../lib";

export default {
  Query: {
    searchRest: (_, args) => {
      const { location: { longitude, latitude }, term } = args;
      if (!term) return [];
      const point = `${latitude},${longitude}`;
      return prisma.raw(
        `select
            earth_distance(ll_to_earth(latitude,longitude), ll_to_earth(${point})) AS distance,
            *
            FROM "Rest"
            INNER JOIN "Location" ON "restId" = "id"
            WHERE (earth_distance(ll_to_earth(latitude,longitude), ll_to_earth(${point})) <= 6000) AND
              (name LIKE '%${term}%')
            ORDER BY 1`);
    }
  }
}