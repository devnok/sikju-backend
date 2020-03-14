import { prisma } from "../../../../generated/prisma-client";

export default{
    Mutation: {
        createOauthAccount: async (_,args) => {
            const { phone, point = 0, provider, token } = args;
            const phoneRegex = /^\d{3}\d{3,4}\d{4}$/;
            if(!phoneRegex.test(phone)){
                throw Error("맞지 않는 휴대폰 번호 형식입니다.");
            }
            const exists = await prisma.$exists.user({
                OR: [
                  { phone },
                  { token, provider }
                ]
              });
            if( exists ){
                throw Error("이미 가입된 사용자 / 휴대전화 입니다.");
            }
            let user;
            if( provider == 'facebook' ) {
                const url = `https://graph.facebook.com/me?access_token=${token}`;
                const res = await fetch(url);
                const { name } = await res.json();
                user = await prisma.createUser({
                    username: name,
                    phone,
                    point,
                    identity: {
                        create: {
                            token, provider: provider.toUpperCase()
                        }
                    }
                });
            }
            return user;
        }
    }
}