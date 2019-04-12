import { BrowserRouter } from 'react-router-dom';
import Card from 'components/Card';

describe('Card', () => {
  it('basic render', () => {
    const wrapper = render(
      <BrowserRouter>
        <Card />
      </BrowserRouter>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
