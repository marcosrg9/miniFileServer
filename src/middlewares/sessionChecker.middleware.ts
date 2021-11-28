import { Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/auth.controller";

export const checkSession = (req: Request, res: Response, next: NextFunction) => {

    if (AuthController.sessionChecker(req.session.user!)) return next();
    
    return res.status(401).json({ payload: 'Not logged '});

}