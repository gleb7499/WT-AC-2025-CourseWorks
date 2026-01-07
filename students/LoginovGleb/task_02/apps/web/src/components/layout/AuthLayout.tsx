import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { useAuth } from '../../contexts';
import { LoadingOverlay } from '../ui';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingOverlay text="Проверка авторизации..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/applications" replace />;
  }

  return (
    <div className="auth-layout">
      <div className="auth-layout__container">
        <Link to="/" className="auth-layout__logo">
          <ClipboardList size={32} />
          <span>Да, я в деле</span>
        </Link>
        <div className="auth-layout__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
