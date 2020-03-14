import { prisma } from "../../../../generated/prisma-client";
import { generateHash } from "../../../utils";

export default{
    Mutation: {
        createAccount: async(_,args) => {
            const { username, point = 0, password, phone } = args;
            const exists = await prisma.$exists.user({
                OR: [
                  phone,
                  username
                ]
              });
            if(exists){
                throw Error("이미 가입된 닉네임 또는 휴대전화입니다.");
            }
            const hashed_password = await generateHash(password);
            const user = await prisma.createUser({
                username,
                point,
                password: hashed_password,
                phone
            });
            return user;
        }
    }
}