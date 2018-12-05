import React from 'react';
import { render } from 'enzyme';
import toJson from 'enzyme-to-json';

import DocLink from 'components/Base/DocLink';

describe('Base/DocLink', () => {
  it('basic render', () => {
    const wrapper = render(
      <DocLink name="STEPPER_FOOTER_CREATE_APP_2">
        《Helm 规范及应用开发》
      </DocLink>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
