import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { observable } from 'mobx';

import SideNav from 'components/Layout/SideNav';

const renderPage = (store, props) => (
  <Provider rootStore={store}>
    <BrowserRouter>
      <SideNav {...props}>
        <div>test</div>
      </SideNav>
    </BrowserRouter>
  </Provider>
);

describe('Layout/SideNav', () => {
  let store,
    props;

  beforeAll(() => {
    store = observable.object({
      appStore: {
        menuApps: [
          {
            app_id: 'app_id',
            name: 'name',
            icon: 'icon'
          }
        ]
      },
      user: {
        portal: 'admin'
      },
      match: {
        appId: '123',
        path: 'app'
      }
    });

    props = {
      className: 'test',
      hasSubNav: true
    };
  });

  it('basic render', () => {
    const wrapper = render(renderPage(store, props));

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('admin portal nav', () => {
    store.user = {
      portal: 'global_admin',
      isAdmin: true,
      isAdminPortal: true
    };
    const wrapper = render(renderPage(store, props));

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('basic render ISV portal', () => {
    store.user = {
      portal: 'isv',
      isISV: true,
      isISVPortal: true
    };
    const wrapper = render(renderPage(store, props));

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('developer portal nav', () => {
    store.user = {
      portal: 'dev',
      isDev: true,
      isDevPortal: true
    };
    const wrapper = render(renderPage(store, props));

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
