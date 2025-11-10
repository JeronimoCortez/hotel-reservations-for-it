import { Request, Response } from "express";
import { MongoUserRepository } from "../repositories/MongoUserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../../../domain/src/entities/User";
import { Roles } from "../../../../domain/src/types/Roles";

const userRepo = new MongoUserRepository();

export class UserController {
    static async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            const existing = await userRepo.findByEmail(email);

            if (existing) return res.status(400).json({ message: "Email already existing" });

            const hashed = await bcrypt.hash(password, 10);
            const user = new User(
                crypto.randomUUID(),
                name,
                email,
                hashed,
                Roles.USER
            );

            await userRepo.save(user);
            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" })
            res.status(200).json({ message: `User ${user.id} - ${user.name} created` })

        } catch (err) {
            res.status(500).json({ message: err instanceof Error ? err.message : err });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await userRepo.findByEmail(email);
            if (!user) return res.status(404).json({ message: "User not found" });

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return res.status(401).json({ message: "Invalid password" });

            const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" })
            return res.status(200).json({ token, user })
        } catch (err) {
            res.status(500).json({ message: err instanceof Error ? err.message : err });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const users = await userRepo.findAll();
            res.status(200).json(users?.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));
        } catch (err) {
            res.status(500).json({ message: err instanceof Error ? err.message : err });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await userRepo.findById(id);

            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role })
        } catch (err) {
            res.status(500).json({ message: err instanceof Error ? err.message : err });
        }
    }

}