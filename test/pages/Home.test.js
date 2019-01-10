import { observable } from 'mobx';
import { Provider } from 'mobx-react';
import {BrowserRouter as Router }from 'react-router-dom';

import Home from 'pages/Home';

describe('Home', () => {
  let rootStore;

  beforeEach(() => {
    rootStore = observable.object({
      config: {},
      notifications: [],
      setNavFix: () => {},
      appStore: {
        homeApps: [],
        appSearch: ''
      },
      categoryStore: {
        getCategoryApps: () => {},
        categories: []
      },
      user: {}
    });
  });

  afterEach(() => {
    rootStore = null;
  });

  const match = { path: '/apps/ctg-zlMzkwYWWW8j', params: {} };

  it('basic render', () => {
    const wrapper = render(
      <Provider rootStore={rootStore}>
        <Router>
          <Home match={match} />
        </Router>
      </Provider>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
