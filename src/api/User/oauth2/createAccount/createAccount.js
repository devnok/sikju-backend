import { getProfile, prisma } from "../../../../lib";

export default{
    Mutation: {
        createAccount: async (_,args) => {
            const { provider, token, code, nickname } = args;
            const profile = await getProfile(args);
			const id = String(profile.id);
            const auth = await prisma.authentication.findOne({ where: { provider_id: { provider, id }}})
            console.log(auth);
            if(!auth || auth.code !== code || auth.provider !== provider || auth.id !== id){
                throw Error("Server Error!");
            }
            return prisma.user.create({
                data: {
                    profile: {
                        create: {
                            email: profile?.email
                        }
                    },
                    links: {
                        create: {
                            provider,
                            token,
                            id
                        }
                    },
                    nickname,
                    phone: auth.phone
                }
            })
        }
    }
}