export const isAuthenticated = req => {
    if (!req.user) {
        throw Error("로그인이 필요한 서비스입니다.");
    }
    return;
}
export const throwError = (msg, code) => {
    throw Error(msg);
}