import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void, reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token as string);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                .then(token => {
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return api(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
            }

            isRefreshing = true;

            try {
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/auth/refresh`, 
                    {}, 
                    { withCredentials: true }
                );

                const newAccessToken = refreshResponse.data.accessToken;

                useAuthStore.setState({ accessToken: newAccessToken });

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);

                return api(originalRequest);

            } catch (refreshError) {
                console.error("Refresh Token cũng đã chết. Bắt buộc đăng nhập lại.");
                processQueue(refreshError, null);
                
                useAuthStore.getState().clearState();
                
                toast.error("Phiên đăng nhập đã hết hạn an toàn. Vui lòng đăng nhập lại!");
                
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;