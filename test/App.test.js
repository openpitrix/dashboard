import { observable, decorate } from 'mobx';
import { Provider } from 'mobx-react';
// import { withRouter } from 'react-router';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import App from 'src/App';
// import routes from 'src/routes';
import renderRoute from 'src/routes/renderRoute';

import Home from 'pages/Home';
import Login from 'pages/Login';
import Header from 'components/Header';
import Footer from 'components/Footer';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

describe('<App/>', () => {
  let store, location, routes;

  beforeEach(() => {
    store = observable.object({
      fixNav: false,
      appStore: {
        appSearch: () => {}
      }
    });

    // mock routes
    routes = [
      { path: '/', component: Home, exact: true },
      { path: '/login', component: Login, exact: true }
    ];
  });

  afterEach(() => {
    store = null;
    routes = [];
  });

  const renderPage = (location, store) => (
    <Provider rootStore={store} sessInfo={null}>
      <BrowserRouter>
        <App location={location}>
          <Switch>
            {routes.map((route, i) => (
              <Route
                key={i}
                exact={route.exact}
                path={route.path}
                render={({ match }) => renderRoute(match, route, store)}
              />
            ))}
          </Switch>
        </App>
      </BrowserRouter>
    </Provider>
  );

  it('basic render', () => {
    location = { pathname: '/' };
    const wrapper = render(renderPage(location, store));
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('body has main className', () => {
    const wrapper = shallow(<App rootStore={store} />);
    expect(wrapper.find('.main').length).toBe(1);
  });

  it('/login page does not have Header and Footer', () => {
    location = { pathname: '/login' };
    const wrapper = shallow(<App rootStore={store} location={location} />);
    expect(wrapper.find(Header).length).toBe(0);
    expect(wrapper.find(Footer).length).toBe(0);
  });
});
