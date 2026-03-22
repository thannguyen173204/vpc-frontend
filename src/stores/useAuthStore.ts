import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/store';

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            accessToken: null,
            user: null,
            loading: false,

            clearState: () => {
                set({ accessToken: null, user: null, loading: false });
            },
            logIn: async (username, password) => {
                try {
                    set({ loading: true });
                    const response = await authService.logIn(username, password);
                    
                    set({ 
                        accessToken: response.accessToken || response.token,
                        user: response.user || { 
                            user_name: username, 
                            display_name: "Quản trị viên",
                            avt_url: ""
                        } 
                    });
                    
                    toast.success('Đăng nhập thành công.');
                    return true;
                } catch (error: any) {
                    const errorMessage = error.response?.data?.error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại kết nối.';
                    toast.error(errorMessage);
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            logOut: async () => {
                try {
                    await authService.logOut();
                } catch (error) {
                    console.error("Logout API failed:", error);
                } finally {
                    get().clearState();
                    toast.success("Đăng xuất thành công!");
                }
            }
        }),
        {
            name: 'minicloud-auth-storage',
        }
    )
);