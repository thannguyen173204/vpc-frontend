import type { User } from "./user";

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;
    clearState: () => void;
    logIn: (username: string,password:string) => Promise<boolean>;
    logOut: () => Promise<void>;
}