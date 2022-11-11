import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import AuthController from "../controllers/auth";
import upload from "../config/multer";
import isAuth from "../middleware/isAuth";

const router = Router();

router
    .post('/signup', upload.single('profilePhoto'),  (req:Request,res:Response,next:NextFunction)=>{
        passport.authenticate('signup', { session: false }, (err: any, user: any, info: any)=>{
            if (err) { return next(err); }
            if (!user) { 
                if(info.message === 'User already exists'){
                    return res.status(409).json({message:info.message});
                }
                return res.json({message:info.message}); 
            }
            
            req.user = user;
            return AuthController.signup(req,res);
        })(req, res,next)
    }, AuthController.signup)
    .post('/login', (req:Request,res:Response,next:NextFunction)=>{
        passport.authenticate('login', { session: false }, (err: any, user: any, info: any)=>{
            if (err) { return next(err); }
            // if (!user) { return res.json({message:info.message}); }
            if(!user){
                if(info.message === 'User not found'){
                    return res.status(404).json({message:info.message});
                }
                return res.status(401).json({message:info.message});
            }
            req.user = user;
            return AuthController.login(req,res);
        })(req, res,next)
    })
    .get('/logout', isAuth, AuthController.logout)
    .post('/', isAuth, AuthController.jwtToken)
    // .post('/forgot-password', AuthController.forgotPassword)
    // .post('/reset-password', AuthController.resetPassword)

export default router;