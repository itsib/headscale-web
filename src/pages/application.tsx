import { Component } from 'preact';
import { Router, Route, lazy } from 'preact-iso';
import { Footer } from '@app-components/footer/footer';
import { Header } from '@app-components/header/header';
import { ErrorBoundary } from '@app-components/error-boundary/error-boundary';
import { Home } from './home';
import { Devices } from './devices/devices';
import { Users } from './users/users.tsx';
import { Tokens } from './tokens';
import { Error404 } from './error-404';

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
              <Route path="/" component={Home}/>
              <Route path="/devices" component={Devices}/>
              <Route path="/users" component={Users}/>
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