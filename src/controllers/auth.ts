import { Request, Response } from "express";
import logger from "../config/logger";
import User from "../models/user";
import sendMail from "../config/nodemailer";

class AuthController {
    static async signup(req:Request,res:Response){
        try {
            if(req.user instanceof User){
                const { password, _id, ...user } = req.user.toObject({ versionKey: false });
                const token = await req.user.generateToken();
                user.token = token;
                const info = await sendMail(user.email,{...user, password, id:_id.toString()});
                logger.info(JSON.stringify(info));
                return res.status(200).json({message:'Signup successful',user:{...user, _id}});
            }
            throw new Error('Signup failed');
        } catch (err) {
            logger.error(JSON.stringify(err));
            return res.status(500).json({message:'Signup failed'});
        }
    }
    static async login(req:Request,res:Response){
        try {
            logger.info('Login successful');
            if(req.user instanceof User){
                const { password, _id, ...user } = req.user.toObject({ versionKey: false });
                const token = await req.user.generateToken(req.body.rememberMe || false);
                user.token = token;
                return res.status(200).json({message:'Login successful',user:{...user, _id}});
            }
            throw new Error('Login failed');
        } catch (err) {
            logger.error(err);
            return res.status(500).json({message:'Signup failed'});
        }
    }

    static async logout(req:Request,res:Response){
        try {
            return res.status(200).json({message:'Logout successful'});
            
        } catch (err) {
            logger.error(JSON.stringify(err));
        }
    }
    static async jwtToken(req:Request,res:Response){
        try {
            if(!req.user){
                throw new Error('JWT token failed');
            }
            return res.status(200).json({message:'JWT token successful',user:req.user});
        } catch (err) {
            logger.error(JSON.stringify(err));
            res.status(500).json({message:'JWT token failed'});
        }
    }
}

export default AuthController;