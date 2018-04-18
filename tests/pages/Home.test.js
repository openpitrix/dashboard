import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import { observable, useStrict } from 'mobx';
import { Provider } from 'mobx-react';

import Home from 'containers/Home';

describe('Home', () => {
  let rootStore;

  beforeEach(() => {
    // turn off strict mode when testing with mock store
    useStrict(false);

    rootStore = observable({
      config: {},
      appStore: {}
    });
  });

  afterEach(() => {
    rootStore = null;
  });

  it('basic render', () => {
    const wrapper = mount(
      <Provider rootStore={rootStore}>
        <Home />
      </Provider>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('call onEnter', () => {
    // todo
  });
});
