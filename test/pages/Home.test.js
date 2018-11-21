import { observable } from 'mobx';
import { Provider } from 'mobx-react';

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
      }
    });
  });

  afterEach(() => {
    rootStore = null;
  });

  const match = { path: '/apps/ctg-zlMzkwYWWW8j', params: {} };

  it('basic render', () => {
    const wrapper = render(
      <Provider rootStore={rootStore}>
        <Home match={match} />
      </Provider>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
