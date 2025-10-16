import { IUser } from "../types/IUser";
import { Roles } from "../types/Roles";


export class User implements IUser {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public password: string,
        public role: Roles,
    ) { }

    changePassword(newPassword: string) {
        this.password = newPassword;
    }

    idAdmin(): boolean {
        return this.role === Roles.ADMIN;
    }
}