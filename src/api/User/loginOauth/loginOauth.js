import { prisma } from "../../../../generated/prisma-client";
import { generateToken } from "../../../utils";

export default {
    Query: {
        loginOauth: async (_, args) => {
            const { provider, token } = args;
            const users = await prisma.users({
                where: {
                    identity: {
                        provider, token
                    }
                }
            });
            if(users.length < 1){
                throw Error("등록되지 않은 사용자입니다.");
            }
            const user = users[0];
            return generateToken(user.id);
        }
    }
}