import React from 'react';
import { render } from 'enzyme';
import toJson from 'enzyme-to-json';

import Upload from 'components/Base/Upload';

describe('Base/Upload', () => {
  it('basic render', () => {
    const wrapper = render(<Upload />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('basic render', () => {
    const wrapper = render(<Upload />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
