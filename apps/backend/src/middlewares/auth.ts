import { NextFunction, Request, Response } from "express";
import { Roles } from "../../../../domain/src/types/Roles";
import jwt from "jsonwebtoken";

type AuthRequest = Request & {
    user?: {
        userId: string;
        role: Roles;
    };
};

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "Missing token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid token format" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: Roles };
        req.user = { userId: payload.userId, role: payload.role };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
