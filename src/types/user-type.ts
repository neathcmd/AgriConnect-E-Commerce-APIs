export interface IUser {
    full_name: string,
    user_name: string,
    phone: string,
    email: string,
    password: string,
    role: string,
}

export type UserPayload = {
    full_name: string,
    user_name: string,
    phone: string,
    email: string,
    password: string,
}