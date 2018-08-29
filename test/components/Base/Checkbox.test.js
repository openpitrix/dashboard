import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Checkbox from 'components/Base/Checkbox';

describe('Base/Checkbox', () => {
  it('basic render', () => {
    const wrapper = render(
      <Checkbox className="test" name="test" disabled>
        option1
      </Checkbox>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('group render', () => {
    const wrapper = render(
      <Checkbox.Group name="test" values={['1', '3']}>
        <Checkbox value="1">option1</Checkbox>
        <Checkbox value="2">option2</Checkbox>
        <Checkbox value="3">option3</Checkbox>
      </Checkbox.Group>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('call onChange', () => {
    const mockChange = jest.fn();
    const wrapper = mount(<Checkbox onChange={mockChange} checked />);
    wrapper.find('input').simulate('change');

    const isChecked = wrapper.state().isChecked;
    expect(isChecked).not.toBeTruthy();
    expect(mockChange).toHaveBeenCalled();
    expect(mockChange).toHaveBeenCalledTimes(1);
    expect(mockChange.mock.calls[0][0].target.checked).toEqual(isChecked);
  });
});
