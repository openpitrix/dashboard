import { BrowserRouter } from 'react-router-dom';

import CheckFiles from 'components/CheckFiles';

describe('Component CheckFiles', () => {
  it('basic render', () => {
    const wrapper = render(
      <CheckFiles className='test' uploadStatus="init" isShowNote />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
