import TitleSearch from 'components/TitleSearch';

describe('Component TitleSearch', () => {
  it('basic render', () => {
    const wrapper = render(<TitleSearch />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
