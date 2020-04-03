import { prisma } from "../../../../generated/prisma-client";
import { generateSecret } from "../../../utils";
import { sendMessage } from "../../../lib";

export default {
	Mutation: {
		requestSecret: async (_, args, {request, isAuthenticated}) => {
			isAuthenticated(request);
			const { phone } = args;
			const exists = await prisma.$exists.user({
				phone, phoneConfirmed: true
			});
			if(exists){
				throw Error("이미 인증된 전화번호입니다.");
			}
			const { id } = request.user;
			const secret = generateSecret(4);
			try {
				await prisma.updateUser({
					where: { id },
					data: {
						secret,
						phone,
						phoneConfirmed: false
					}
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