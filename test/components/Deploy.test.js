import Deploy from 'components/Deploy';

describe('Component Deploy ', () => {
  it('basic render', () => {
    const wrapper = render(<Deploy />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
