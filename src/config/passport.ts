import  passport from  'passport' ;
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user';
import logger from './logger';

passport.use(
    'signup',
    new LocalStrategy(
        { 
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (user) {
                    logger.info("User already exists");
                    return done(null, false, { message: 'User already exists' });
                }
                const newUser = await User.create({
                    ...req.body,
                    email,
                    password,
                    profile_photo_path: req.file?.path.replace('public', '') || null
                 });
                return done(null, newUser);
            } catch (err) {
                done(err);
            }
        }
    )
)

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email }).select('-refreshToken');
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                const isMatch = await user.comparePassword(password);
                if(!isMatch){
                    return done(null, false, { message: 'Incorrect password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });

            } catch (error) {
                logger.error(JSON.stringify(error));;
            }
        }
    )
)

passport.use(
    'jwt',
    new JwtStrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {            
            try {
                const user = await User.findById(token._id).select('-refreshToken');
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
               logger.error(JSON.stringify(error));;
                done(error);
            }
        }
    )
)