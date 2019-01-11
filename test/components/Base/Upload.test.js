import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Upload from 'components/Base/Upload';

const findByRef = wrapper => ref => wrapper.findWhere(node => node.getDOMNode() === wrapper.instance()[ref]);

const image = {
  name: 'cat.jpg',
  size: 1000,
  type: 'image/jpeg'
};

describe('Base/Upload', () => {
  it('basic render', () => {
    const wrapper = render(<Upload />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('disabled', () => {
    const wrapper = mount(<Upload disabled directory />);
    expect(wrapper.prop('disabled')).toBeTruthy();
  });

  it('call onChange', () => {
    const wrapper = mount(<Upload />);

    wrapper.findByRef = findByRef(wrapper);

    const input = wrapper.findByRef('fileInput');
    input.simulate('change', { target: { files: [image] } });
  });

  it('call onFileDrop', () => {
    const wrapper = mount(<Upload accept="jpg" />);
    wrapper.simulate('click');
    wrapper.simulate('keyDown', { key: 'Enter' });
    wrapper.simulate('dragOver', { type: 'dragover' });
    wrapper.simulate('dragOver', { type: 'dragleave' });
    wrapper.simulate('drop', { dataTransfer: { files: [image] } });
    wrapper.unmount();
  });
});
