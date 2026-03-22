import { useAuthStore } from '@/stores/useAuthStore'
import { Navigate, Outlet } from 'react-router';

const PublicRoute = () => {
    const { accessToken } = useAuthStore();
    if (accessToken) {
        return <Navigate to="/dashboard" replace={true} />
    }
    return <Outlet></Outlet>
}

export default PublicRoute