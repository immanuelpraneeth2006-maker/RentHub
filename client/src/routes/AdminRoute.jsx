import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying administrator credentials..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 bg-[#22160f] border border-rose-900/60 rounded-3xl text-center shadow-2xl text-white">
        <div className="w-16 h-16 bg-rose-950/70 border border-rose-800 text-rose-300 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          !
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-stone-300 mb-6 text-sm">
          Administrator privileges are required to access this portal. If you are an administrator, please sign in with an admin account.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-2.5 bg-[#9c5221] hover:bg-[#b86328] text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            Return to Home
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-2.5 bg-[#180f0a] border border-[#422d1f] text-stone-300 rounded-xl text-xs font-semibold hover:bg-[#2c1d14] transition"
          >
            My User Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
