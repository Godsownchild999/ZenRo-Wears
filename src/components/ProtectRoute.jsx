// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute expects isAuth boolean (or function) to decide access.
 * Usage: <Route path="/secret" element={<ProtectedRoute isAuth={isAuthenticated}><Secret /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ isAuth, children }) {
  // If you use context or a hook to check auth, call it here instead of prop.
  if (!isAuth) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}