import Select from 'components/Base/Select';

const { Option } = Select;

describe('Base/Select', () => {
  let props = {};
  let items = ['item1', 'item2', 'item3'];
  beforeAll(() => {
    props = { ...props };
    items = [...items];
  });
  it('basic render', () => {
    const wrapper = render(
      <Select {...props}>
        {items.map(item => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
      </Select>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
