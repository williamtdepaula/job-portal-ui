import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const KNOWN_ROLES = ['ROLE_JOB_SEEKER', 'ROLE_EMPLOYER', 'ROLE_ADMIN'];

const ROLE_HOME = {
  ROLE_JOB_SEEKER: '/jobs',
  ROLE_EMPLOYER: '/employer/jobs',
  ROLE_ADMIN: '/admin',
};

// Client-side guards are UX only, not a security boundary: the role comes from localStorage.
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div role="status" aria-label="Loading" className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Default-deny: require a non-empty allowedRoles list and a known role that is allowed
  const role = user?.role;
  const hasAccess =
    Array.isArray(allowedRoles) &&
    allowedRoles.length > 0 &&
    KNOWN_ROLES.includes(role) &&
    allowedRoles.includes(role);

  if (!hasAccess) {
    return <Navigate to={ROLE_HOME[role] ?? '/'} replace />;
  }

  return children;
};
