import { Component } from 'preact';
import { Router, Route, lazy, ErrorBoundary } from 'preact-iso';
import { Footer } from '@app-components/footer/footer';
import { Header } from '@app-components/header/header';
import { Home } from './home';
import { Nodes } from './nodes';
import { Users } from './users';
import { Tokens } from './tokens';
import { Error404 } from './error-404';
import { Error500 } from './error-500';

const Acl = lazy(() => import('./acl'));
const Metrics = lazy(() => import('./metrics'));

export class Application extends Component<any, any> {

  render() {
    return (
      <div className="ui-scroll">
        <Header />
        <div className="container mt-[var(--header-height)] min-h-[var(--content-height)]">
          <ErrorBoundary>
            <Router>
              <Route path='/' component={Home} />
              <Route path='/nodes' component={Nodes} />
              <Route path='/users' component={Users} />
              <Route path='/tokens' component={Tokens} />
              <Route path='/acl/:tab*' component={Acl} />
              <Route path='/metrics/:tab*' component={Metrics} />
              <Route path='/error-500' component={Error500} />
              <Route path='/error-404' component={Error404} />
              <Route default component={Error404} />
            </Router>
          </ErrorBoundary>
          <div className="h-[20px]" />
        </div>
        <Footer />
      </div>
    );
  }
}