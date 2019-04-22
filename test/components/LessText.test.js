import LessText from 'components/LessText';

describe('Component LessText', () => {
  it('basic render test', () => {
    const wrapper = <LessText txt={'wordwordwordwordword'} limit={10} />;
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
