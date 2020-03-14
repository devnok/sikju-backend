import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import FacebookTokenStrategy from 'passport-facebook-token'
import { prisma } from '../generated/prisma-client';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}
const verifyUser = async (payload, done) => {
    try{
        const { id } = payload;
        const user = await prisma.user({ id });
        if(user){
            return done(null, user);
        } else {
            return done(null, false);
        }
    }catch(err){
        return done(err,false);
    }
}
export const authenticateJwt = (req, res, next) =>
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if(user){
            req.user = user;
        }
        next();
    })(req, res, next);
passport.use(new JwtStrategy(opts, verifyUser));

// passport-facebook-token
const fbOpts = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    fbGraphVersion: 'v6.0'
}
const FacebookTokenStrategyCallback = (accessToken, refreshToken, profile, done) => done(null, {
    accessToken,
    refreshToken,
    profile,
});
passport.use(new FacebookTokenStrategy(fbOpts, FacebookTokenStrategyCallback));

export const authenticateFacebook = (req, res) => new Promise((resolve, reject) => {
    passport.authenticate('facebook-token', { session: false }, (err, data, info) => {
        if (err) reject(err);
        resolve({ data, info });
    })(req, res);
});