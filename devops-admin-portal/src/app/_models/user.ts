import { Role } from "./role";

export class User {
    id: number;
    account: string;
    password: string;
    name: string;
    role: Role;
    token?: string;
    status: string;
    info: string;
    created: string;
    avatar: string;
    owner_id: number;

    isSAdmin() {
      return this.role == Role.SAdmin;
    }

    isAdmin() {
      return this.role == Role.Admin;
    }

    isUser() {
      return this.role == Role.User;
    }
}
