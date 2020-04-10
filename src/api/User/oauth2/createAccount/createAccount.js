import { prisma } from "../../../../../generated/prisma-client";
import { getProfile } from "../../../../lib";

export default{
    Mutation: {
        createAccount: async (_,args) => {
            const { provider, id, phone, nickname, gender, email, name } = args;
            const data = await getProfile(provider, token);
            const phoneRegex = /^\d{3}\d{3,4}\d{4}$/;
            if(!phoneRegex.test(phone)){
                throw Error("맞지 않는 휴대폰 번호 형식입니다.");
            }
            const pv = provider.toLowerCase();
            const link = { [pv+"Id"]: id }
            const exists = await prisma.$exists.user({
                OR: [
                    { phone },
                    { link }
                ]
              });
            if( exists ){
                throw Error("이미 가입된 사용자 / 휴대전화 입니다.");
            }
            return prisma.createUser({
                profile: { create: {
                    gender, email, name
                } },
                phone,
                link: {
                    create: link
                },
            });
        }
    }
}