import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';
const LogOut = () => {
    const {logOut}= useAuthStore();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
            navigate('/login');
        }
    };
  return (
    <Button onClick={handleLogout}>Log Out</Button>
  )
}

export default LogOut