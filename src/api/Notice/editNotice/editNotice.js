import { prisma } from "../../../lib";

export default {
    Query: {
        editNotice: (_, args) => {
            const { id, tag, title, body } = args;
            return prisma.notice.update({
                where: { id },
                data: {
                    tag, title, body
                }
            })
        }
    }
}