import ProviderName from 'components/TdName/ProviderName';

describe('Component ProviderName', () => {
  it('basic render', () => {
    const wrapper = render(<ProviderName />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('has find provider', () => {
    const wrapper = render(<ProviderName name="qingcloud" />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
