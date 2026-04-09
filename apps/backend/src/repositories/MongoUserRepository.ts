import { User } from "../../../../domain/dist/entities/User";
import { Roles } from "../../../../domain/dist/types/Roles";
import { IUserRepository } from "../../../../domain/dist/use-cases/ports/IUserRepository";
import UserModel from "../models/UserModel";


export class MongoUserRepository implements IUserRepository {
    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id).lean();
        if (!user || !user._id) return null;
        const role = user.role === Roles.ADMIN ? Roles.ADMIN : Roles.USER;
        return new User(String(user._id), user.name ?? "", user.email ?? "", user.password ?? "", role);
    }
    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email }).lean();
        if (!user) return null;
        const role = user.role === Roles.ADMIN ? Roles.ADMIN : Roles.USER;
        return new User(String(user._id), user.name ?? "", user.email ?? "", user.password ?? "", role);
    }

    async findAll(): Promise<User[]> {
        const users = await UserModel.find().lean();
        return users.map((u) => {
            const role = u.role === Roles.ADMIN ? Roles.ADMIN : Roles.USER;
            return new User(String(u._id), u.name ?? "", u.email ?? "", u.password ?? "", role);
        })
    }

    async save(user: User): Promise<void> {
        await UserModel.updateOne(
            { _id: user.id },
            { _id: user.id, name: user.name, email: user.email, password: user.password, role: user.role },
            { upsert: true }
        )
    }
}
