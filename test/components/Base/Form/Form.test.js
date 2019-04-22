import Form from 'components/Base/Form/form';

describe('Base/Form', () => {
  it('basic render', () => {
    const wrapper = render(<Form data={{ name: 'test' }}/>);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
