import React from 'react';
import { render } from 'enzyme';
import toJson from 'enzyme-to-json';

import Popover from 'components/Base/Popover';

describe('Base/PopoverIcon', () => {
  it('basic render', () => {
    const wrapper = render(
      <Popover className="test" content="test">
        hover me
      </Popover>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
