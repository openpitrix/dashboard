import { BrowserRouter } from 'react-router-dom';

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
