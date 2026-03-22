import api from '@/lib/axios'; // Đường dẫn đến file axios của bạn
import { useAuthStore } from '@/stores/useAuthStore';

// Hàm lấy token động
const getConfig = () => ({
    headers: { Authorization: `Bearer ${useAuthStore.getState().accessToken}` }
});

export const vmService = {
    createVm: async (data: { vmName: string, vmUsername: string, vmPassword: string, cpu: number, ram: number, disk: number, osName: string }) => {
        const response = await api.post('/api/vm/create', data, getConfig());
        return response.data;
    },
    getAllInstances: async () => {
        const response = await api.get('/api/vm/get', getConfig());
        return response.data.vms; 
    },
    startVm: async (vmName: string) => {
        const response = await api.post('/api/vm/start', { vmName }, getConfig());
        return response.data;
    },
    stopVm: async (vmName: string) => {
        const response = await api.post('/api/vm/stop', { vmName }, getConfig());
        return response.data;
    },
    restartVm: async (vmName: string) => {
        const response = await api.post('/api/vm/restart', { vmName }, getConfig());
        return response.data;
    },
    configVm: async (data: { vmName: string, cpu: number, ram: number, disk: number, vmPassword: string }) => {
        const response = await api.post('/api/vm/config', data, getConfig());
        return response.data;
    },
    deleteVm: async (vmName: string) => {
        const response = await api.post('/api/vm/delete', { vmName }, getConfig());
        return response.data;
    },
    getSystemStats: async () => {
        // Dùng getConfig() để gửi kèm Access Token giống các hàm trên
        const response = await api.get('/api/vm/system-stats', getConfig());
        // Trả về thẳng cục data 'stats'
        return response.data.stats;
    }
};