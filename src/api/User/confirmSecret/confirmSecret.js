import { prisma } from "../../../../generated/prisma-client";
import { generateSecret, generateToken } from "../../../utils";
import { sendMessage } from "../../../lib";

export default {
  Mutation: {
    confirmSecret: async (_, args) => {
      const { phone, secret: secretCode } = args;
      const secret = await prisma.secret({ phone });
      if(secret.secret === secretCode){
        await prisma.deleteSecret({ id: secret.id });
        return true;
      } else {
        console.log("잘못된 인증번호를 보냄.");
        return false;
      }
    }
  }
}