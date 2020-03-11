import { prisma } from "../../../../generated/prisma-client";
import { generateSecret } from "../../../utils";
import { sendMessage } from "../../../lib";

export default {
	Mutation: {
		requestSecret: async (_, args) => {
			const { phone } = args;
			const loginSecret = generateSecret(4);
			try {
				await prisma.updateUser({ data: { loginSecret }, where: { phone } });
				await sendMessage(phone, `[의식주] 인증코드는 [${loginSecret}] 입니다.`);
				return true;
			} catch (e) {
				console.log(e);
				return false;
			}
		}
	}
}