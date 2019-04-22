import Item from 'components/Base/Form/item';
import Input from 'components/Base/Input';

describe('Base/Form Item', () => {
  it('basic render', () => {
    const wrapper = render(
      <Item formData={{ name: 'test' }}>
        <Input name="name" />
      </Item>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
