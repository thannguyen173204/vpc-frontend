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
                    const { accessToken } = await authService.logIn(username, password);
                    set({ accessToken });
                    toast.success('Đăng nhập thành công.');
                    return true;
                } catch (error) {
                    console.error(error);
                    toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
                    return false;
                } finally {
                    set({ loading: false });
                }
            },
            logOut: async () => {
                try {
                    await authService.logOut();
                } catch (error) {
                    console.error(error);
                    toast.error("Có lỗi xảy ra, vui lòng thử lại");
                } finally {
                    get().clearState();
                    toast.success("Đăng xuất thành công!");
                }
            }
        }
        ), {
        name: 'minicloud-auth-storage',
    }
    )

);