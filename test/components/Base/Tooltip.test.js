import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Tooltip from 'components/Base/Tooltip';

describe('Base/Tooltip', () => {
  it('basic render', () => {
    const wrapper = render(
      <Tooltip className="test" content="test">
        hover me
      </Tooltip>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('call onVisibleChange', () => {
    const mockChange = jest.fn();
    const wrapper = mount(
      <Tooltip content="test" trigger="click" onVisibleChange={mockChange} visible>
        <button>Click me</button>
      </Tooltip>
    );
    const instance = wrapper.instance();

    instance.handleTogglePopper();
    expect(mockChange).toHaveBeenCalled();
    expect(wrapper.state().visible).not.toBeTruthy();
  });
});
