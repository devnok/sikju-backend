import { prisma } from "../../../generated/prisma-client";

export default {
    User: {
        restUser: ({id}) => prisma.user({ id }).restUser(),
        identity: ({id}) => prisma.user({ id }).identity()
    }
}