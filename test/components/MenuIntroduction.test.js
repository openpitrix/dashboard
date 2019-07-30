import MenuIntroduction from 'components/MenuIntroduction';

describe('Layout/MenuIntroduction', () => {
  it('basic render', () => {
    const wrapper = render(
      <MenuIntroduction
        activeIndex={1}
        total={4}
        title={'title'}
        description={'test'}
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
