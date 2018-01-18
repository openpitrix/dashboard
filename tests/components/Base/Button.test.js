import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Button from 'components/Base/Button';

configure({ adapter: new Adapter() });

describe('Base/Button', ()=> {
  it('render without crash', ()=> {
    const wrapper=shallow(<Button/>);
  });

  it('primary type', ()=> {
    const wrapper=shallow(<Button className='primary' />);
    expect(wrapper.hasClass('primary')).toBeTruthy();
  });

  it('call onClick', ()=> {
    //
  });
});
