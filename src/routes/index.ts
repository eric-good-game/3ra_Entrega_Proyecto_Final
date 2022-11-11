import { Request, Response, Router } from "express";
import authRouter from "./auth";
import apiRouter from "./api";

const router = Router();

router.use("/auth/v1", authRouter);
router.use("/api/v1", apiRouter);

router.get('*', (req:Request,res:Response)=>{
    res.sendFile('index.html', {root: './public'});

})

export default router;