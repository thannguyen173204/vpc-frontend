import api from "@/lib/axios";

export const authService = {
    logIn: async (
        username: string,
        password: string
    ) => {
        const res = await api.post("/api/auth/login", { username, password }, { withCredentials: true });
        return res.data;
    },
    logOut: async () => {
        return await api.post("/api/auth/logout", {}, { withCredentials: true });

    }

}