import { FC, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/header/header.tsx';

export const LayoutPage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('headscale.token');
    const url = localStorage.getItem('headscale.url');
    if (pathname !== '/' && (!token || !url)) {
      navigate('/', { replace: true });
    } else if (pathname === '/' && token && url) {
      navigate('/machines', { replace: true });
    }
  }, [pathname]);

  return (
    <>
      <Header />

      <div className="max-h-[calc(100vh-60px)] overflow-y-auto pb-8">
        <Outlet />
      </div>
    </>
  );
}