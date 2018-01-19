import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { observable, useStrict } from 'mobx';
import { Provider } from 'mobx-react';

import Home from 'containers/Home';
import Nav from 'components/Nav';
import AppList from 'components/AppList';

configure({ adapter: new Adapter() });

describe('Home', ()=> {
  let rootStore;

  beforeEach(()=> {
    // turn off strict mode when testing with mock store
    useStrict(false);

    rootStore = observable({
      config: {},
      appStore: {},
    });
  });

  afterEach(()=> {
    rootStore = null;
  });

  it('render without crash', ()=> {
    const wrapper = shallow(<Provider rootStore={rootStore}><Home /></Provider>);
  });

  it('has Nav and AppList component', ()=> {
    // if use shallow, child Nav and AppList will not be rendered
    // can inspect this by using jest snapshot
    const wrapper = mount(<Provider rootStore={rootStore}><Home /></Provider>);
    expect(wrapper.find(Nav).length).toBe(1);
    expect(wrapper.find(AppList).length).toBe(1);
  });

  it('call onEnter', ()=> {
    // todo
  });
});
