import { generateToken } from "../../../../utils";
import { prisma } from "../../../../../generated/prisma-client";
import { getProfile } from "../../../../lib";

export default {
    Mutation: {
        login: async (_, args) => {
            const { provider, id } = args;
            const pv = provider.toLowerCase();
            const userInput = { [pv+"Id"]: id }
            const user = await prisma.accountLink(userInput).user();
            if(!user){
                throw Error("Register First")
            }
            return generateToken(user.id);
        }
    }
}