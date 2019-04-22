import { Provider } from 'mobx-react';
import { observable } from 'mobx';

import Notification from 'components/Base/Notification';

describe('Base/Notification', () => {
  const store = observable.object({
    notifications: [{ ts: 1, message: 'note1' }, { ts: 2, message: 'note2' }]
  });
  it('basic render', () => {
    const wrapper = render(
      <Provider rootStore={store}>
        <Notification />
      </Provider>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
