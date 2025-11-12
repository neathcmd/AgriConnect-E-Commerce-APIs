export type UserRole = "admin" | "farmer" | "user";


export interface IUser {
    full_name: string,
    user_name: string,
    phone: string,
    email: string,
    password: string,
    role: UserRole,
}

export interface UserPayload {
    full_name: string,
    user_name: string,
    phone: string,
    email: string,
    password: string,
}