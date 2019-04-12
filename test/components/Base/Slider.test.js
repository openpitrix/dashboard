import Slider from 'components/Base/Slider';

describe('Base/Slider', () => {
  it('basic render', () => {
    const onChange = jest.fn();
    const wrapper = render(<Slider onChange={onChange}/>);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
