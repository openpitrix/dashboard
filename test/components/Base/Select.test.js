import Select from 'components/Base/Select';

const { Option } = Select;

describe('Base/Select', () => {
  let props = {};
  let items = [
    {
      value: 'item1'
    },
    {
      value: 'item2',
      isSelected: true
    },
    {
      value: 'item3'
    }
  ];

  const getWrapper = () => (
    <Select {...props}>
      {items.map(({ value, ...restProps }) => (
        <Option key={value} {...restProps}>
          {value}
        </Option>
      ))}
    </Select>
  );

  beforeAll(() => {
    props = { ...props };
    items = [...items];
  });

  it('basic render', () => {
    const wrapper = render(getWrapper());

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('disabled render', () => {
    props.disabled = true;
    const wrapper = render(getWrapper());
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
