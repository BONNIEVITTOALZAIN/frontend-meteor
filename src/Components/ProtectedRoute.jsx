import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Jika belum login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Jika role tidak diizinkan
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Jika lolos semua cek
  return children;
}

export default ProtectedRoute;
