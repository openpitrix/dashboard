import PopoverIcon from 'components/Base/PopoverIcon';

describe('Base/PopoverIcon', () => {
  it('basic render', () => {
    const wrapper = render(
      <PopoverIcon name={'view'} icon={'eye'}/>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
