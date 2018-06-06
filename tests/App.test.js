import { observable, useStrict } from 'mobx';
import { Provider } from 'mobx-react';
// import { withRouter } from 'react-router';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import App from 'src/App';
import routes from 'src/routes';
import renderRoute from 'src/routes/renderRoute';
import Header from 'components/Header';
import Footer from 'components/Footer';

describe('<App/>', () => {
  let store, location;

  beforeEach(() => {
    useStrict(false);

    store = observable({
      fixNav: false
    });
  });

  afterEach(() => {
    store = null;
  });

  const renderPage = (location, store) => {
    return (
      <Provider rootStore={store}>
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
  };

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

  it('page except /login have both Header and Footer', () => {
    location = { pathname: '/' };
    const wrapper = shallow(<App rootStore={store} location={location} />);
    expect(wrapper.find(Header).length).toBe(1);
    expect(wrapper.find(Footer).length).toBe(1);
  });
});
