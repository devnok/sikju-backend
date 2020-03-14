import { prisma } from "../../../../generated/prisma-client";
import { generateSecret } from "../../../utils";
import { sendMessage } from "../../../lib";

export default {
	Mutation: {
		requestSecret: async (_, args) => {
			const { phone } = args;
			const secret = generateSecret(4);
			try {
				await prisma.createSecret({
					phone,
					secret
				})
				await sendMessage(phone, `[의식주] 인증코드는 [${secret}] 입니다.`);
				return true;
			} catch (e) {
				console.log(e);
				return false;
			}
		}
	}
}