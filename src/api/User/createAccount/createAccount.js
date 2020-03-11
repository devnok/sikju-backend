import { prisma } from "../../../../generated/prisma-client";

export default{
    Mutation: {
        createAccount: async(_,args) => {
            const { username, phone, point = 0 } = args;
            const phoneRegex = /^\d{3}\d{3,4}\d{4}$/;
            if(!phoneRegex.test(phone)){
                throw Error("맞지 않는 휴대폰 번호 형식입니다.");
            }
            const exists = await prisma.$exists.user({
                OR: [
                  {
                    username
                  },
                  { phone }
                ]
              });
            if(exists){
                throw Error("이미 가입된 사용자 / 휴대전화 입니다.");
            }
            const user = await prisma.createUser({
                username,
                phone,
                point
            });
            return user;
        }
    }
}