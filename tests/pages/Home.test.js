import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import { observable, useStrict } from 'mobx';
import { Provider } from 'mobx-react';

import Home from 'pages/Home';

describe('Home', () => {
  let rootStore;

  beforeEach(() => {
    // turn off strict mode when testing with mock store
    useStrict(false);

    rootStore = observable({
      config: {},
      appStore: {
        apps: [],
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
