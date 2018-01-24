import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Table from 'components/Base/Table';

configure({ adapter: new Adapter() });

const setup = (props = {}, type) => {
  const wrapper = type === 'mount' ? mount(<Table {...props}/>) : shallow(<Table {...props}/>);

  return {
    wrapper,
    props: wrapper.instance().props,
  };
};

describe('Base/Table', () => {
  const columns = [
    {
      title: 'Name', dataIndex: 'name', key: 'name', width: '50%',
    },
    {
      title: 'Age', dataIndex: 'age', key: 'age', width: '50%',
    },
  ];
  const dataSource = [
    {
      name: 'zhangsan', age: 20, key: '1',
    },
    {
      name: 'lisi', age: 22, key: '2',
    },    
  ];
  const rowSelection = {
    selectedRowKeys: [],
    onChange: jest.fn(),
    onSelect: jest.fn(),
    onSelectAll: jest.fn(),
  };  

  it('render without crash', () => {
    const { wrapper } = setup();
  });

  it('custom columns & data', () => {
    const { wrapper } = setup({ columns, dataSource }, 'mount');
    
    expect(wrapper.find('thead th').length).toEqual(columns.length);
    expect(wrapper.find('tbody tr').length).toEqual(dataSource.length);
  });

  it('call change', () => {
    const { wrapper } = setup({ columns, dataSource, rowSelection }, 'mount');
    const checkbox = wrapper.find('tbody tr').first().find('td').at(0).find('input[type="checkbox"]');
    checkbox.simulate('change', { target: { checked: true } });

    const mockChange = rowSelection.onChange;
    expect(wrapper.state().selectionDirty).toBeTruthy();
    expect(mockChange).toHaveBeenCalled();
    expect(mockChange.mock.calls[0][0]).toEqual(['1']);
  });

  it('call select one', () => {
    const { wrapper } = setup({ columns, dataSource, rowSelection }, 'mount');
    const checkbox = wrapper.find('tbody tr').first().find('td').at(0).find('input[type="checkbox"]');
    checkbox.simulate('change', { target: { checked: true } });

    const mockSelect = rowSelection.onSelect;
    expect(wrapper.state().selectionDirty).toBeTruthy();
    expect(mockSelect).toHaveBeenCalled();
    expect(mockSelect.mock.calls[0][1]).toEqual(dataSource[0]);
  });

  it('call select all', () => {
    const { wrapper } = setup({ columns, dataSource, rowSelection }, 'mount');
    const checkbox = wrapper.find('thead th').at(0).find('input[type="checkbox"]');
    checkbox.simulate('change', { target: { checked: true } });

    const mockSelectAll = rowSelection.onSelectAll;
    expect(wrapper.state().selectionDirty).toBeTruthy();
    expect(mockSelectAll).toHaveBeenCalled();
    expect(mockSelectAll.mock.calls[0][1]).toEqual(dataSource);
  });
});
