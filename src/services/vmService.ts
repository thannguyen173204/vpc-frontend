import api from '@/lib/axios';

export const vmService = {
    createVm: async (data: { vmName: string, vmUsername: string, vmPassword: string, cpu: number, ram: number, disk: number, osName: string }) => {
        const response = await api.post('/api/vm/create', data);
        return response.data;
    },
    getAllInstances: async () => {
        const response = await api.get('/api/vm/get');
        return response.data.vms; 
    },
    startVm: async (vmName: string) => {
        const response = await api.post('/api/vm/start', { vmName });
        return response.data;
    },
    stopVm: async (vmName: string) => {
        const response = await api.post('/api/vm/stop', { vmName });
        return response.data;
    },
    restartVm: async (vmName: string) => {
        const response = await api.post('/api/vm/restart', { vmName });
        return response.data;
    },
    configVm: async (data: { vmName: string, cpu: number, ram: number, disk: number, vmPassword: string }) => {
        const response = await api.post('/api/vm/config', data);
        return response.data;
    },
    deleteVm: async (vmName: string) => {
        const response = await api.post('/api/vm/delete', { vmName });
        return response.data;
    },
    
    // ĐÃ SỬA: Nhận tham số timeRange và truyền lên Backend qua query string (?timeRange=...)
    getSystemStats: async (timeRange: string = '1h') => {
        const response = await api.get(`/api/vm/system-stats?timeRange=${timeRange}`);
        return response.data.stats;
    }
};