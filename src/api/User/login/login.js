import { generateToken, compareHash }from '../../../utils'
import { prisma } from '../../../../generated/prisma-client';
export default {
    Query: {
        login: async (_, args) => {
            const { phone, password } = args;
            const user = await prisma.user({ phone });
            if(!user){
                throw Error("등록되지 않은 사용자입니다.");
            }
            const res = await compareHash(password, user.password);
            if(!res){
                throw Error("비밀번호가 맞지 않습니다.");
            }
            return generateToken(user.id);
        }
    }
}