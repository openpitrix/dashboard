import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { observable } from 'mobx';

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
          <ClusterCard
            detail={{
              name: 'test cluster',
              cluster_id: 'cl_xxxxxx',
              status: 'active',
              owner: 'system',
              create_time: '2019-04-09T03:39:28Z',
              upgrade_time: '2019-04-19T03:39:28Z'
            }}
          />
        </BrowserRouter>
      </Provider>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
