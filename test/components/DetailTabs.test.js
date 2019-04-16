import SideNav from 'components/Layout/SideNav';
import DetailTabs from 'components/DetailTabs';

describe('Component DetailTabs ', () => {
  it('basic render', () => {
    const wrapper = render(<DetailTabs />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
