import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { observable } from 'mobx';

import Layout from 'components/Layout';

const renderPage = (store, props) => (
  <Provider rootStore={store}>
    <BrowserRouter>
      <Layout {...props}>
        <div>test</div>
      </Layout>
    </BrowserRouter>
  </Provider>
);

describe('Layout', () => {
  let store;
  let props = {
    noNotification: true
  };
  beforeAll(() => {
    store = observable.object({
      user: {}
    });

    props = {
      ...props
    };
  });

  it('basic render', () => {
    const wrapper = render(renderPage(store, props));

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
