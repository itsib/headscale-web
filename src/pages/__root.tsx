import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Header } from '@app-components/header/header.tsx';
import { Footer } from '@app-components/footer/footer.tsx';
import { RouterContext } from '@app-types';
import './__root.css';

const RootLayout = () => (
  <div className="ui-scroll root-page">
    <Header />

    <div className="container root-content">
      <Outlet />
    </div>
    <Footer />
  </div>
);

export const Route = createRootRouteWithContext<RouterContext>()({ component: RootLayout });
