import VersionType from 'components/VersionType';

describe('Component VersionType', () => {
  it('basic render', () => {
    const wrapper = render(<VersionType />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('has types', () => {
    const wrapper = render(<VersionType types="helm" />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
