import { generateSecret } from "../../../utils";
import { sendMessage, prisma, getProfile } from "../../../lib";

export default {
	Mutation: {
		requestSecret: async (_, args) => {
            const { phone, provider, token } = args;
            console.log(provider,token);
            const profile = await getProfile(args);
            if(!profile.id) throw Error("Server error");
            const id = String(profile.id);
            console.log(profile);
            const code = generateSecret(4);
            const auth = await prisma.authentication.findOne({ where: { provider_id: { provider, id }}})
            if(auth){
                if(auth.limit < 1){
                    throw Error("문자 인증번호는 하루에 최대 5회 받을 수 있습니다.");
                } else {
                    await prisma.authentication.update({
                        where: { provider_id: { provider, id }},
                        data: {
                            code,
                            expireAt: new Date(Date.now() + 5 * 60 * 1000),
                        }
                    })
                }
            } else {
                await prisma.authentication.create({
                    data: {
                        code,
                        provider,
                        id,
                        phone,
                        expireAt: new Date(Date.now() + 5 * 60 * 1000)
                    }
                })
            }
			try {
				await sendMessage(phone, `[의식주] 인증코드는 [${code}] 입니다.`);
				return true;
			} catch (e) {
				console.log(e);
				return false;
			}
		}
	}
}