import Setion from 'components/Base/Form/section';

describe('Base/Form Setion', () => {
  it('basic render', () => {
    const wrapper = render(<Setion />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
