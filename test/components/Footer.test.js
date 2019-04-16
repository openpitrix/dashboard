import { BrowserRouter } from 'react-router-dom';

import SideNav from 'components/Layout/SideNav';
import Footer from 'components/Footer';

describe('Base/Footer', () => {
  it('basic render', () => {
    const wrapper = render(
        <BrowserRouter><Footer /></BrowserRouter>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
