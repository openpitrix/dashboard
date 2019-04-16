import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { observable } from 'mobx';

import SideNav from 'components/Layout/SideNav';
import ClusterCard from 'components/DetailCard/ClusterCard';

describe('Component ClusterCard ', () => {
  let store;

  beforeAll(() => {
    store = observable.object({});
  });

  it('basic render', () => {
    const wrapper = render(
      <Provider rootStore={store}>
        <BrowserRouter>
          <ClusterCard />
        </BrowserRouter>
      </Provider>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
