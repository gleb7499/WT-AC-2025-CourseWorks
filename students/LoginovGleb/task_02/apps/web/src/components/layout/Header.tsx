import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, FileText, ClipboardList, Settings, Users } from 'lucide-react';
import { useAuth } from '../../contexts';
import { Button } from '../ui';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator' || isAdmin;

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          <ClipboardList size={24} />
          <span>Да, я в деле</span>
        </Link>

        <nav className="header__nav">
          {isAuthenticated && (
            <Link to="/applications" className="header__link">
              <FileText size={18} />
              <span>Заявки</span>
            </Link>
          )}

          <Link to="/forms" className="header__link">
            <ClipboardList size={18} />
            <span>Формы</span>
          </Link>

          {isAuthenticated && isModerator && (
            <Link to="/statuses" className="header__link">
              <Settings size={18} />
              <span>Статусы</span>
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <Link to="/admin" className="header__link">
              <Users size={18} />
              <span>Админ</span>
            </Link>
          )}
        </nav>

        <div className="header__actions">
          {isAuthenticated ? (
            <div className="header__user">
              <span className="header__username">
                {user?.username}
                <span className="header__role">({user?.role})</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                data-testid="logout-btn"
              >
                <LogOut size={18} />
              </Button>
            </div>
          ) : (
            <div className="header__auth">
              <Link to="/login">
                <Button variant="ghost" size="sm">Войти</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Регистрация</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
