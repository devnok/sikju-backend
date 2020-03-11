import { generateToken }from '../../../utils'
export default {
    Query: {
        login: (_, args) => {
            const { id } = args;
            return generateToken(id);
        }
    }
}