import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Switch from 'components/Base/Switch';

describe('Base/Switch', () => {
  it('basic render', () => {
    const wrapper = render(
      <Switch onText="on" offText="off" disabled />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('call onChange', () => {
    const mockChange = jest.fn();
    const wrapper = mount(
      <Switch checked onChange={mockChange} />
    );
    wrapper.simulate('click');

    const isChecked = wrapper.state().on;
    expect(isChecked).not.toBeTruthy();    
    expect(mockChange).toHaveBeenCalled();
    expect(mockChange).toHaveBeenCalledTimes(1);
    expect(mockChange.mock.calls[0][0]).toEqual(isChecked);
  });
});
