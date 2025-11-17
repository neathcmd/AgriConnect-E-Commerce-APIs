// import { UserRole } from "./user-type";

export type tokenPayload = {
    _id: string;
    email: string;
    // roles: UserRole[];
};

export interface AuthUser {
  _id: string;
  email: string;
  // roles: UserRole[];
}
