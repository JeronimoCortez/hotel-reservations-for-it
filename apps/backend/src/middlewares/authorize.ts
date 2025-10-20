// middlewares/authorize.ts
import { Request, Response, NextFunction } from "express";
import { Roles } from "../../../../domain/src/types/Roles";

type AuthRequest = Request & {
    user?: {
        userId: string;
        role: Roles;
    };
};

export const authorize = (...allowedRoles: Roles[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: "Forbidden: You do not have access" });
        }
        next();
    };
};
