import { prisma } from "../../../generated/prisma-client";

export default {
    User: {
        link: ({id}) => prisma.user({ id }).link(),
        coupons: ({id}) => prisma.user({ id }).coupons(),
        likes: ({id}) => prisma.user({ id }).likes()
    }
}