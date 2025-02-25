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

  onRouteChange(url: string) {
    console.log(url);
  }

  render() {
    return (
      <div className="ui-scroll">
        <Header />
        <div className="container mt-[var(--header-height)] min-h-[var(--content-height)]">
          <ErrorBoundary>
            <Router onRouteChange={this.onRouteChange.bind(this)}>
              <Route path='/' component={Home} />
              <Route path='/nodes' component={Nodes} />
              <Route path='/users' component={Users} />
              <Route path='/tokens' component={Tokens} />
              <Route path='/acl/:tab*' component={Acl} />
              <Route path='/metrics/:tab*' component={Metrics} />
              <Route path='/error-500' component={Error500} />
              <Route default component={Error404} />
            </Router>
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    );
  }
}