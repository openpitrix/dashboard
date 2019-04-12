import { BrowserRouter } from 'react-router-dom';
import Toolbar from 'components/Toolbar';

describe('Component Toolbar', () => {
  it('basic render', () => {
    const wrapper = render(<BrowserRouter><Toolbar /></BrowserRouter>);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
