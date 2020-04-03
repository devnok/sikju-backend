import { prisma } from "../../../../generated/prisma-client";
import { generateSecret, generateToken } from "../../../utils";
import { sendMessage } from "../../../lib";

export default {
  Mutation: {
    confirmSecret: async (_, args, {request, isAuthenticated}) => {
      const { phone: phoneProp, secret: secretCode } = args;
			const { id } = request.user;
      const { secret, phone } = await prisma.user({ id });
      if(secret === secretCode && phone == phoneProp){
        await prisma.updateUser({
					where: { id },
					data: {
            secret: '',
            phoneConfirmed: true
          },
				})
        return true;
      } else {
        console.log("잘못된 인증번호를 보냄.");
        return false;
      }
    }
  }
}