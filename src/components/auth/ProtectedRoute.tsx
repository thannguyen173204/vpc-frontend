import { useAuthStore } from '@/stores/useAuthStore'
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = () => {
  const {accessToken}= useAuthStore();
  if (!accessToken){
    return(
      <Navigate to="/login" replace={true}/>
    )
  }
  return (
    <Outlet></Outlet>
  )
}

export default ProtectedRoute