import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Checkbox from 'components/Base/Checkbox';

configure({ adapter: new Adapter() });

const setup = (props = {}, children, type) => {
  const wrapper = type === 'mount' ? mount(<Checkbox {...props}>{children}</Checkbox>) : 
    shallow(<Checkbox {...props}>{children}</Checkbox>);

  return {
    wrapper,
    props: wrapper.instance().props,
  };
};

describe('Base/Checkbox', () => {
  it('render without crash', () => {
    const { wrapper } = setup();
  });

  it('custom className', () => {
    const { wrapper } = setup({ className: 'test' });
    expect(wrapper.hasClass('test')).toBeTruthy();
  });

  it('custom name', () => {
    const { props } = setup({ name: 'test' });
    expect(props.name).toEqual('test');
  });

  it('custom text', () => {
    const { wrapper } = setup({}, 'option-1');
    expect(wrapper.text()).toEqual('option-1');
  });

  it('disabled', () => {
    const { wrapper, props } = setup({ disabled: true });
    expect(props.disabled).toBeTruthy();
    expect(wrapper.hasClass('disabled')).toBeTruthy();
  });

  it('call onChange', () => {
    const mockChange = jest.fn();
    const { wrapper } = setup({ checked: true, onChange: mockChange }, null, 'mount');
    wrapper.find('input').simulate('change');

    const isChecked = wrapper.state().isChecked;
    expect(isChecked).not.toBeTruthy();
    expect(mockChange).toHaveBeenCalled();
    expect(mockChange).toHaveBeenCalledTimes(1);
    expect(mockChange.mock.calls[0][0].target.checked).toEqual(isChecked);
  });
});
