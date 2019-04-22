import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { observable } from 'mobx';

import Header from 'components/Header';

const renderPage = store => (
  <Provider rootStore={store}>
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  </Provider>
);

describe('Layout/Header', () => {
  let store;

  beforeAll(() => {
    store = observable.object({
      user: {
        isLoggedIn: () => true
      }
    });
  });

  it('basic render: login', () => {
    const wrapper = render(renderPage(store));

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('no login', () => {
    store.user = {
      isLoggedIn: () => false
    };
    const wrapper = render(renderPage(store));

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
