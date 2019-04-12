import Status from 'components/Status';

describe('Component Status', () => {
  it('basic render', () => {
    const wrapper = render(<Status name="active" type="active" />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('has transition', () => {
    const wrapper = render(<Status transition="starting" />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
