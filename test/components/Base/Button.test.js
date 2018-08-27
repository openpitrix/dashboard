import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Button from 'components/Base/Button';

describe('Base/Button', () => {
  it('basic render', () => {
    const wrapper = render(
      <Button className="test" htmlType="submit" loading>
        test button
      </Button>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('call onClick', () => {
    const mockClick = jest.fn();
    const wrapper = mount(
      <Button name="test" onClick={mockClick}>
        Click me
      </Button>
    );
    wrapper.simulate('click');

    expect(mockClick).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalledTimes(1);
    expect(mockClick.mock.calls[0][0].target.name).toEqual('test');
  });
});
