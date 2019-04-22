import AppStatistics from 'components/AppStatistics';

describe('AppStatistics', () => {
  it('basic render', () => {
    const wrapper = render(<AppStatistics />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('app detail statistics', () => {
    const wrapper = render(<AppStatistics isAppDetail />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
