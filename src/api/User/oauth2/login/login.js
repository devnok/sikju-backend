import { generateToken } from "../../../../utils";
import { getProfile, prisma } from "../../../../lib";

export default {
    Mutation: {
        login: async (_, args) => {
            const { provider, token } = args;
            let { id } = await getProfile(args);
            id = String(id);
            const link = await prisma.accountLink
                .findOne({
                    where: {
                        provider_id: { provider, id }
                    }
                })
            if(!link){
                throw Error("Register First")
            }
            return generateToken(link.userId);
        }
    }
}