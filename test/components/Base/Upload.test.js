import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Upload from 'components/Base/Upload';

const findByRef = wrapper => ref => wrapper.findWhere(node => node.getDOMNode() === wrapper.instance()[ref]);

const fileName = 'test.zip';

describe('Base/Upload', () => {
  it('basic render', () => {
    const wrapper = render(<Upload />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('call onChange', () => {
    const wrapper = mount(<Upload />);

    wrapper.findByRef = findByRef(wrapper);

    const input = wrapper.findByRef('fileInput');
    input.simulate('change', { target: { files: [fileName] } });
  });

  it('disabled', () => {
    const wrapper = mount(<Upload disabled />);
    expect(wrapper.prop('disabled')).toBeTruthy();
    wrapper.unmount();
  });
});
