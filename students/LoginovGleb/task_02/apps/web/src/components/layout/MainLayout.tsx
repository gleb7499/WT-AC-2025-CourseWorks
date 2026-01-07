import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const MainLayout: React.FC = () => {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        <div className="layout__container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
