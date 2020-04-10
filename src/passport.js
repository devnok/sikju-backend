import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as FacebookStrategy } from 'passport-facebook'
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