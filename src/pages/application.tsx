import { Component } from 'preact';
import { Router, Route, lazy } from 'preact-iso';
import { Footer } from '@app-components/footer/footer';
import { Header } from '@app-components/header/header';
import { ErrorBoundary } from '@app-components/error-boundary/error-boundary';
import { HomePage } from './home';
import { DevicesPage } from './devices/devices';
import { UsersPage } from './users/users.tsx';
import { Tokens } from './tokens';
import { Error404 } from './error-404';
import { DevicePage } from './device/device.tsx';

const Acl = lazy(() => import('./acl'));
const Metrics = lazy(() => import('./metrics'));

export class Application extends Component<any, any> {

  render() {
    return (
      <ErrorBoundary>
        <div className="ui-scroll min-w-[316px]">
          <Header/>
          <div className="container mt-[var(--header-height)] min-h-[var(--content-height)] h-full">
            <Router>
              <Route path="/" component={HomePage}/>
              <Route path="/devices" component={DevicesPage}/>
              <Route path="/device/:id" component={DevicePage}/>
              <Route path="/users" component={UsersPage}/>
              <Route path="/tokens" component={Tokens}/>
              <Route path="/acl/:tab*" component={Acl}/>
              <Route path="/metrics/:tab*" component={Metrics}/>
              <Route path="/error-404" component={Error404}/>
              <Route default component={Error404}/>
            </Router>
          </div>
          <Footer/>
        </div>
      </ErrorBoundary>
    );
  }
}