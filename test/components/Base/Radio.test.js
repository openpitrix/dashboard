import React from 'react';

import Radio from 'components/Base/Radio';

describe('Base/Radio', () => {
  it('basic render', () => {
    const wrapper = render(
      <Radio value="1" className="test" name="test" disabled>
        option1
      </Radio>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('group render', () => {
    const wrapper = render(
      <Radio.Group name="test" values="1">
        <Radio value="1">option1</Radio>
        <Radio value="2">option2</Radio>
        <Radio value="3">option3</Radio>
      </Radio.Group>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
