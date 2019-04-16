import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Swipe from 'components/Base/Swipe';

describe('Base/Swipe', () => {
  it('basic render', () => {
    const wrapper = render(
      <Swipe>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </Swipe>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('no render', () => {
    const wrapper = render(<Swipe />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('render no dots', () => {
    const wrapper = render(
      <Swipe showDots={false} height={500} width={500} unit="px">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </Swipe>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('call click dot', () => {
    const wrapper = mount(
      <Swipe>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
      </Swipe>
    );
    const dotsComponent = wrapper.find('.dotsOuter');
    dotsComponent.childAt(2).simulate('click');
    const { current } = wrapper.state();
    expect(current).toBe(3);
  });
});
