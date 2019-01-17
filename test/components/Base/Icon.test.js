import { Icon } from 'components/Base';

/* eslint-disable no-unused-vars */

describe('Base/Icon', () => {
  it('basic render', () => {
    const wrapper = shallow(<Icon name="app" />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('svg').hasClass('qicon')).toBe(true);
  });

  it('calls componentWillMount', () => {
    const spy = jest.spyOn(Icon.prototype, 'componentWillMount');
    const wrapper = mount(<Icon name="app" />);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(window.iconfont__svg__inject).toBeTruthy();
  });

  it('render when prop size is number', () => {
    const wrapper = shallow(<Icon name="app" size={20} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('render when prop color is not empty', () => {
    const color = { primary: '#aaa' };
    const wrapper = shallow(<Icon name="app" color={color} />);
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('svg').prop('style')['--primary-color']).toEqual(
      color.primary
    );
  });
});
