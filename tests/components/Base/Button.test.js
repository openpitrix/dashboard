import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import renderer from 'react-test-renderer';

import Button from 'components/Base/Button';

configure({ adapter: new Adapter() });

describe('Base/Button', ()=> {
  it('render without crash', ()=> {
    const wrapper=shallow(<Button/>);
  });

  it('primary type', ()=> {
    const wrapper=shallow(<Button className='primary' />);
    expect(wrapper.hasClass('primary')).toBeTruthy();

    // since server-side scss is transformed, classnames may not work
    // const tree=renderer.create(<Button className='primary' />).toJSON();
    // expect(tree).toMatchSnapshot();
  });

  it('call onClick', ()=> {

  })
});