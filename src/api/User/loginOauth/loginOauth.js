import { prisma } from "../../../../generated/prisma-client";
import { generateToken } from "../../../utils";

export default {
    Mutation: {
        loginOauth: async (_, args, { throwError }) => {
            const { provider, token } = args;
            const url = provider == 'KAKAO' ?
                `https://kapi.kakao.com/v2/user/me` : (
                    provider == 'FACEBOOK' ? `https://graph.facebook.com/me?access_token=${token}` : ''
                );
            if(!url){
                throwError('잘못된 요청입니다.', 'E_WRONG_REQUEST');
            }
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if(data.code === -401){ // token 만료
                throwError('잘못된 요청입니다.', 'E_WRONG_REQUEST');
            }
            const { id } = data;

            const pv = provider.toLowerCase();
            const userInput = { [pv+"Id"]: String(id) };
            let user = await prisma.user(userInput)
            if(!user){
                let name = provider == 'KAKAO' ? data.kakao_account.profile.nickname : data.name;
                user = await prisma.createUser({
                    name,
                    username: `${privder}${name}`,
                    ...userInput,
                    identity: {
                        create: {
                            token, provider
                        }
                    }
                })
            } else {
                const identity = await prisma.user(userInput).identity();
                if(identity.token !== token){
                    await prisma.updateIdentity({
                        data: {
                            token,
                            provider
                        },
                        where: { id: identity.id }
                    })
                }
            }
            return generateToken(user.id);
        }
    }
}