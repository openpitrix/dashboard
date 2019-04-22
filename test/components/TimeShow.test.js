import TimeShow from 'components/TimeShow';

describe('Component TimeShow', () => {
  it('basic render', () => {
    const wrapper = render(<TimeShow time='2019-04-09T03:39:28Z' />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
