import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Pagination from 'components/Base/Pagination';

configure({ adapter: new Adapter() });

const setup = (props = {}, type) => {
  const wrapper = type === 'mount' ? mount(<Pagination {...props}/>) : shallow(<Pagination {...props}/>);

  return {
    wrapper,
    props: wrapper.instance().props,
  };
};

describe('Base/Pagination', () => {
  it('render without crash', () => {
    const { wrapper } = setup();
  });

  it('custom className', () => {
    const { wrapper } = setup({ className: 'test' });
    expect(wrapper.hasClass('test')).toBeTruthy();
  });

  it('call onChange', () => {
    const mockChange = jest.fn();
    const { wrapper } = setup({ defaultCurrent: 2, onChange: mockChange }, 'mount');

    wrapper.find('.pi-pagination-next').simulate('click');
    expect(mockChange).toHaveBeenCalled();
    expect(mockChange).toHaveBeenCalledTimes(1);
    expect(mockChange.mock.calls[0][0]).toEqual(3);
  });
});
