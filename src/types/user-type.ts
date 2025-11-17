// export type UserRole = "ADMIN" | "FARMER" | "CUSTOMER";


export interface IUser {
    full_name: string,
    user_name: string,
    phone: string,
    email: string,
    password: string,
    // roles: UserRole[],
}

export interface UserPayload {
    full_name: string,
    user_name: string,
    phone: string,
    email: string,
    password: string,
}