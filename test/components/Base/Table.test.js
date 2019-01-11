import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import Table from 'components/Base/Table';

const setup = (type, props = {}) => (type === 'render'
  ? render(<Table {...props} />)
  : mount(<Table {...props} />));

describe('Base/Table', () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
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
      key: '1'
    },
    {
      name: 'lisi',
      age: 22,
      key: '2'
    }
  ];
  const rowSelection = {
    selectedRowKeys: [],
    onChange: jest.fn(),
    onSelect: jest.fn(),
    onSelectAll: jest.fn()
  };
  const pagination = {
    tableType: 'Clusters',
    onChange: jest.fn(),
    total: 2,
    current: 2
  };
  it('basic render', () => {
    const wrapper = setup('render', { columns, dataSource });

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('render emptyText', () => {
    const wrapper = setup('render', { columns, dataSource: [] });

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('call onChange', () => {
    const wrapper = setup('mount', {
      columns,
      dataSource,
      rowSelection,
      pagination
    });
    const checkbox = wrapper
      .find('tbody tr')
      .first()
      .find('td')
      .at(0)
      .find('input[type="checkbox"]');
    checkbox.simulate('change', { target: { checked: true } });

    const mockChange = rowSelection.onChange;
    expect(wrapper.state().selectionDirty).toBeTruthy();
    expect(mockChange).toHaveBeenCalled();
    expect(mockChange.mock.calls[0][0]).toEqual(['1']);
  });

  it('call onSelect', () => {
    const wrapper = setup('mount', {
      columns,
      dataSource,
      rowSelection,
      pagination
    });
    const checkbox = wrapper
      .find('tbody tr')
      .first()
      .find('td')
      .at(0)
      .find('input[type="checkbox"]');
    checkbox.simulate('change', { target: { checked: true } });

    const mockSelect = rowSelection.onSelect;
    expect(wrapper.state().selectionDirty).toBeTruthy();
    expect(mockSelect.mock.calls[0][1]).toEqual(dataSource[0]);
  });

  it('call onSelectAll', () => {
    const wrapper = setup('mount', {
      columns,
      dataSource,
      rowSelection,
      pagination
    });
    const checkbox = wrapper
      .find('thead th')
      .at(0)
      .find('input[type="checkbox"]');
    checkbox.simulate('change', { target: { checked: true } });

    const mockSelectAll = rowSelection.onSelectAll;
    expect(wrapper.state().selectionDirty).toBeTruthy();
    expect(mockSelectAll).toHaveBeenCalled();
    expect(mockSelectAll.mock.calls[0][1]).toEqual(dataSource);
  });

  it('call remove onSelectAll', () => {
    const wrapper = setup('mount', {
      columns,
      dataSource,
      rowSelection,
      pagination
    });
    const checkbox = wrapper
      .find('thead th')
      .at(0)
      .find('input[type="checkbox"]');
    const mockSelectAll = rowSelection.onSelectAll;
    checkbox.simulate('change', { target: { checked: true } });
    expect(mockSelectAll).toHaveBeenCalled();
    checkbox.simulate('change', { target: { checked: false } });
    expect(mockSelectAll).toHaveBeenCalled();
  });

  it('call handleSort', () => {
    const wrapper = setup('mount', {
      columns,
      dataSource,
      rowSelection,
      pagination
    });
    const icon = wrapper
      .find('thead th')
      .at(1)
      .find('span.icon');
    icon.simulate('click');
  });
});
