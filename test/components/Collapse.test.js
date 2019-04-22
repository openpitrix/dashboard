import Collapse from 'components/Collapse';

describe('Component Collapse ', () => {
  it('basic render', () => {
    const wrapper = render(<Collapse toggleType={'header'} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
