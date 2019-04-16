import { BrowserRouter } from 'react-router-dom';

import SideNav from 'components/Layout/SideNav';
import EnhanceTable from 'components/EnhanceTable';

describe('Component EnhanceTable ', () => {
  it('basic render', () => {
    const wrapper = render(
      <BrowserRouter>
        <EnhanceTable />
      </BrowserRouter>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
