import { Provider } from 'mobx-react';
import { observable } from 'mobx';

import TdName from 'components/TdName';

describe('Component TdName', () => {
  const store = observable.object({});
  const props = {
    name: 'name',
    description: 'test',
    isFold: true
  };

  it('basic render', () => {
    const wrapper = render(
      <Provider rootStore={store}>
        <TdName {...props} />
      </Provider>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
