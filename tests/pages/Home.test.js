import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import renderer from 'react-test-renderer';

import { observable, useStrict } from 'mobx';

import Home from 'containers/Home';
import Nav from 'components/Nav';
import AppList from 'components/AppList';

configure({ adapter: new Adapter() });

describe('Home', ()=>{
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

  it('render without crash', ()=>{
    const wrapper = shallow(<Home rootStore={rootStore} />);
  });

  it('has Nav and AppList component', ()=> {
    // if use shallow, child Nav and AppList will not be rendered
    // can inspect this by using jest snapshot
    const wrapper = mount(<Home rootStore={rootStore}/>);
    expect(wrapper.find(Nav).length).toBe(1);
    expect(wrapper.find(AppList).length).toBe(1);
  });

  it('call onEnter', ()=> {
    // todo
  });

  // xit('snapshot', ()=> {
  //   const tree=renderer.create(<Home rootStore={rootStore} />).toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
});