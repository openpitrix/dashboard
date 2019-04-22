import { BrowserRouter } from 'react-router-dom';

import Logo from 'components/Logo';

describe('Component Logo', () => {
  it('basic render', () => {
    const wrapper = render(
      <BrowserRouter>
        <Logo url="/" />
      </BrowserRouter>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
