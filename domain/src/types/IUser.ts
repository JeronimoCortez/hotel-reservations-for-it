import { Roles } from "./Roles";

export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    rol: Roles;
}