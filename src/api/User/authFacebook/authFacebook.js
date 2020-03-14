import { authenticateFacebook } from "../../../passport";
import { prisma } from "../../../../generated/prisma-client";
import { generateToken } from '../../../utils';

export default {
    Mutation: {
        authFacebook: async (_, args, {request, response}) => {
            const { access_token, phone } = args;
            request = {...request, access_token};

            const { data, info } = await authenticateFacebook(request, response);

            if(data){
                console.log(data);
                const { accessToken, profile } = data;
                const users = await prisma.users({
                    where: {
                        identity: {
                            provider: 'FACEBOOK',
                            id: profile.id
                        }
                    }
                });
                const user = users.length > 0 ? users[0] :
                    await prisma.createUser({
                        username: profile.displayName || `${profile.familyName} ${profile.givenName}`,
                        identity: {
                            create: {
                                token: accessToken,
                                provider: 'FACEBOOK',
                                id: profile.id
                            }
                        },
                        email: profile.emails[0].value,
                        phone
                    });
                return generateToken(user.id);
            }
            if(info) throw Error(JSON.stringify(info));
            throw Error('로그인이 유효하지 않습니다. 다시 로그인해주세요.');
        }
    }
}