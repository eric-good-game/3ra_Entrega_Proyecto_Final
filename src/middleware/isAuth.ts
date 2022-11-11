import { NextFunction, Request, Response } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import User from "../models/user";
import logger from "../config/logger";

const checkToken = (token:string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return {err:null,valid:true,decoded};
    } catch (err) {
        return {err,valid:false,decoded:null};
    }
}
const isAuth = (req: Request, res: Response, next: NextFunction) => {
    
    passport.authenticate('jwt', { session: false }, async function(err,user,info) {
        
        try {
            
            if (err) { 
                logger.error(JSON.stringify(err));
                return res.json({message:err.message});
                
            }
            if(user){
                const {password, refreshToken, token, ...userWithoutPasswordAndTokens} = user.toObject({versionKey:false});
                req.user = userWithoutPasswordAndTokens;
                return next()
            }
            if(info?.message === "invalid token"){
                return res.status(401).json('Unauthorized');
            }
            if(info?.message === "jwt expired"){
                const token = req.headers.authorization?.split(" ")[1]
                
                const user = await User.findOne({token}).select('-password');
                const refreshToken = user?.refreshToken;
            
                if(refreshToken){
                    const {err} = checkToken(refreshToken);
                    if(err){
                        return res.status(401).json('Unauthorized');
                    }
                    const newToken = await user.generateToken();
                    const {password, refreshToken:rT, ...userWithoutPasswordAndTokens} = user.toObject({versionKey:false});
                    req.user = {...userWithoutPasswordAndTokens,token:newToken};
                    return next();
                }else{
                    return res.status(401).json('Unauthorized');
                }
            }
            if(info?.message){
                return res.status(401).json(info.message);
            }
        } catch (error) {
            logger.error(JSON.stringify(error));            
        }

    }
    )(req, res,next)
}

export default isAuth;