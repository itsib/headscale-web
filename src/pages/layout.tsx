import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/header/header.tsx';
import { AuthProvider } from '../context/auth/auth.provider.tsx';

export const LayoutPage: FC = () => (
  <AuthProvider>
    <Header />
    <div className="max-h-[calc(100vh-60px)] overflow-y-auto pb-8">
      <Outlet />
    </div>
  </AuthProvider>
);