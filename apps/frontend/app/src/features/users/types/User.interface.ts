import type { Role } from "./Role.enum";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}