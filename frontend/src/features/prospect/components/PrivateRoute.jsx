import { Navigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, accessToken } = useAuthStore();
  
  // Still restoring session from localStorage → show spinner
  if (accessToken && !isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#11111b]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-[#cba6f7] border-t-transparent animate-spin" />
          <p className="text-[#6c7086] text-sm">Loading Leapfrog Connect...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
