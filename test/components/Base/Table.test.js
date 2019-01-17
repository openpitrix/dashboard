import { Table } from 'components/Base/Table';

const initTableProps = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      onChangeSort: () => {},
      width: '50%'
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: '50%'
    }
  ];

  const dataSource = [
    {
      name: 'zhangsan',
      age: 20,
      key: 1
    },
    {
      name: 'lisi',
      age: 22,
      key: 2
    }
  ];
  const rowSelection = {
    selectedRowKeys: []
    // onChange: jest.fn(),
    // onSelect: jest.fn(),
    // onSelectAll: jest.fn()
  };
  const pagination = {
    tableType: 'Clusters',
    // onChange: jest.fn(),
    total: 2,
    current: 2
  };

  return {
    columns,
    dataSource,
    rowSelection,
    pagination
  };
};

describe('Base/Table', () => {
  let props = initTableProps();

  beforeAll(() => {
    props = {
      ...props,
      location: { search: '' },
      history: {
        push: x => x
      }
    };
  });

  it('basic render', () => {
    const wrapper = render(<Table {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('render emptyText', () => {
    const ownProps = { ...props, dataSource: [] };
    const wrapper = render(<Table {...ownProps} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it(`each row has one checkbox`, () => {
    const wrapper = render(<Table {...props} />);
    const checkbox = wrapper
      .find('tbody tr')
      .first()
      .find('td input[type="checkbox"]');

    expect(checkbox.length).toEqual(1);
  });

  it('call onChange', () => {
    const spyOnChange = jest.fn();
    props.rowSelection.onChange = spyOnChange;

    const wrapper = mount(<Table {...props} />);
    const checkbox = wrapper
      .find('tbody tr')
      .first()
      .find('td input[type="checkbox"]');

    checkbox.simulate('change', { target: { checked: true } });

    expect(wrapper.state('selectionDirty')).toBeTruthy();
    expect(spyOnChange).toHaveBeenCalled();
    expect(spyOnChange.mock.calls[0][0]).toEqual([1]);
  });

  it('call onSelect', () => {
    const spyOnSelect = jest.fn();
    props.rowSelection.onSelect = spyOnSelect;

    const wrapper = mount(<Table {...props} />);
    const checkbox = wrapper
      .find('tbody tr')
      .first()
      .find('td input[type="checkbox"]');

    checkbox.simulate('change', { target: { checked: true } });

    expect(wrapper.state('selectionDirty')).toBeTruthy();
    expect(spyOnSelect).toHaveBeenCalled();
    expect(spyOnSelect.mock.calls[0][1]).toEqual(props.dataSource[0]);
  });

  it('selectAll / removeAll', () => {
    const spyOnSelectAll = jest.fn();
    props.rowSelection.onSelectAll = spyOnSelectAll;

    const wrapper = mount(<Table {...props} />);
    const checkbox = wrapper
      .find('thead th')
      .at(0)
      .find('input[type="checkbox"]');

    expect(checkbox.length).toBe(1);

    checkbox.simulate('change', { target: { checked: true } });

    expect(spyOnSelectAll).toHaveBeenCalled();
    expect(spyOnSelectAll.mock.calls[0][1]).toEqual(props.dataSource);

    // remove all
    checkbox.simulate('change', { target: { checked: false } });
    expect(spyOnSelectAll).toHaveBeenCalled();
    expect(spyOnSelectAll.mock.calls[1][1]).toEqual([]);
  });

  it('call handleSort', () => {
    const wrapper = mount(<Table {...props} />);
    const icon = wrapper
      .find('thead th')
      .at(1)
      .find('span.icon');

    const reverse = wrapper.state('reverse');
    icon.simulate('click');

    expect(reverse).not.toEqual(wrapper.state('reverse'));
  });
});
