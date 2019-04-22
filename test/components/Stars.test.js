import Stars from 'components/Stars';

describe('Component Stars', () => {
  it('basic render', () => {
    const wrapper = render(<Stars starTotal={5}/>);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
