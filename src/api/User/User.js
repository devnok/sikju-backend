export default {
    User: {
        restUser: ({id}) => prisma.user({ id }).restUser()
    }
}