import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

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
      },
      setNavFix: () => {}
    });
  });

  afterEach(() => {
    rootStore = null;
  });

  let match = { path: '/apps/ctg-zlMzkwYWWW8j', params: {} };

  it('basic render', () => {
    const wrapper = render(
      <Provider rootStore={rootStore}>
        <Home match={match} />
      </Provider>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
