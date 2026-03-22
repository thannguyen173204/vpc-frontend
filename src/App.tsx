import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from 'sonner';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Instances from "./pages/Instances";

export default function App() {
  return <>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vms" element={<Instances />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </>
}
