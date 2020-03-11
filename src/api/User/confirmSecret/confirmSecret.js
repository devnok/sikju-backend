import { prisma } from "../../../../generated/prisma-client";
import { generateSecret, generateToken } from "../../../utils";
import { sendMessage } from "../../../lib";

export default {
  Mutation: {
    confirmSecret: async (_, args) => {
      const { phone, secret } = args;
      const user = await prisma.user({ phone });
      if(user.loginSecret === secret){
        await prisma.updateUser({
          data: { loginSecret: "" },
          where: { id: user.id }
        });
        return generateToken(user.id);
      } else {
        throw Error("잘못된 인증번호입니다.")
      }
    }
  }
}