import React from 'react';
import RcTable from 'rc-table';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import { Checkbox, Radio, Popover, Tooltip, Icon } from 'components/Base';
import Status from 'components/Status';
import Loading from 'components/Loading';
import styles from './index.scss';

export default class Table extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    dataSource: PropTypes.array,
    columns: PropTypes.array,
    pagination: PropTypes.bool,
    rowSelection: PropTypes.object,
    isLoading: PropTypes.bool,
    filterList: PropTypes.array
  };

  static defaultProps = {
    prefixCls: 'pi-table',
    dataSource: [],
    columns: [],
    pagination: false,
    rowKey: 'key',
    rowSelection: null
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: (props.rowSelection || {}).selectedRowKeys || [],
      selectionDirty: false
    };
  }

  getTableData = () => {
    const { rowKey } = this.props;
    const data = [...this.props.dataSource];

    data.map((item, i) => {
      if (!item[rowKey]) {
        item[rowKey] = item.id || i;
      }
      return item;
    });
    return data;
  };

  getItemKey = (item, index) => {
    const rowKey = this.props.rowKey;
    const itemKey = typeof rowKey === 'function' ? rowKey(item, index) : item[rowKey];
    return itemKey === undefined ? index : itemKey;
  };

  getDefaultSelection = () =>
    this.getTableData()
      .filter(item => item.checked)
      .map((item, i) => this.getItemKey(item, i));

  setSelectedRowKeys = (selectedRowKeys, { selectType, item, checked, changeRowKeys }) => {
    const { rowSelection } = this.props;
    this.setState({
      selectedRowKeys,
      selectionDirty: true
    });

    const data = this.getTableData();

    if (!rowSelection.onChange && !rowSelection[selectType]) {
      return;
    }
    const selectedRows = data.filter(
      (row, i) => selectedRowKeys.indexOf(this.getItemKey(row, i)) !== -1
    );
    if (rowSelection.onChange) {
      rowSelection.onChange(selectedRowKeys, selectedRows);
    }

    if (rowSelection[selectType]) {
      switch (selectType) {
        default:
        case 'onSelect':
          rowSelection[selectType](checked, item, selectedRows);
          break;
        case 'onSelectAll': {
          const changeRows = data.filter(
            (row, i) => changeRowKeys.indexOf(this.getItemKey(row, i)) !== -1
          );
          rowSelection[selectType](checked, selectedRows, changeRows);
          break;
        }
        case 'onSelectInvert':
          rowSelection[selectType](selectedRowKeys);
          break;
      }
    }
  };

  handleCheckboxSelect = (value, index, e) => {
    const { rowKey } = this.props;
    const checked = e.target.checked;
    const defaultSelection = this.state.selectionDirty ? [] : this.getDefaultSelection();
    let selectedRowKeys = this.state.selectedRowKeys.concat(defaultSelection);

    if (checked) {
      selectedRowKeys.push(value[rowKey]);
    } else {
      selectedRowKeys = selectedRowKeys.filter(key => value[rowKey] !== key);
    }

    this.setSelectedRowKeys(selectedRowKeys, {
      selectType: 'onSelect',
      item: value,
      checked
    });
  };

  handleRadioSelect = () => {};

  handleSelectAll = e => {
    const type = e.target.checked ? 'all' : 'removeAll';
    const data = this.getTableData();
    const defaultSelection = this.state.selectionDirty ? [] : this.getDefaultSelection();
    const selectedRowKeys = this.state.selectedRowKeys.concat(defaultSelection);
    const changeableRowKeys = data
      .filter(item => !item.disabled)
      .map((item, i) => this.getItemKey(item, i));

    const changeRowKeys = [];
    let selectType = '';
    let checked;

    switch (type) {
      default:
      case 'all':
        changeableRowKeys.forEach(key => {
          if (selectedRowKeys.indexOf(key) === -1) {
            selectedRowKeys.push(key);
            changeRowKeys.push(key);
          }
        });
        selectType = 'onSelectAll';
        checked = true;
        break;
      case 'removeAll':
        changeableRowKeys.forEach(key => {
          if (selectedRowKeys.indexOf(key) !== -1) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
            changeRowKeys.push(key);
          }
        });
        selectType = 'onSelectAll';
        checked = false;
        break;
      case 'invert':
        changeableRowKeys.forEach(key => {
          if (selectedRowKeys.indexOf(key) === -1) {
            selectedRowKeys.push(key);
          } else {
            selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
          }
          changeRowKeys.push(key);
        });
        selectType = 'onSelectInvert';
        break;
    }

    this.setSelectedRowKeys(selectedRowKeys, {
      selectType,
      checked,
      changeRowKeys
    });
  };

  renderSelectionBox = type => (value, row, index) => {
    const handleChange = e => {
      e.stopPropagation();
      type === 'radio'
        ? this.handleRadioSelect(value, index, e)
        : this.handleCheckboxSelect(value, index, e);
    };

    if (type === 'radio') {
      return <Radio />;
    }

    return (
      <Checkbox
        disabled={value.disabled}
        checked={this.state.selectedRowKeys.indexOf(value[this.props.rowKey]) !== -1}
        onChange={handleChange}
      />
    );
  };

  renderRowSelection = () => {
    const { rowSelection, columns } = this.props;
    const tableColumns = [...columns];

    if (rowSelection) {
      const data = this.getTableData();
      const selectionColumn = {
        key: 'selection-column',
        render: this.renderSelectionBox(rowSelection.type),
        className: styles.selectionColumn,
        fixed: rowSelection.fixed
      };

      if (rowSelection.type === 'radio') {
        selectionColumn.title = '';
      } else {
        const allChecked = data.length
          ? data.every(
              (item, i) => this.state.selectedRowKeys.indexOf(this.getItemKey(item, i)) !== -1
            )
          : false;
        selectionColumn.title = <Checkbox checked={allChecked} onChange={this.handleSelectAll} />;
      }

      if (tableColumns[0] && tableColumns[0].key === 'selection-column') {
        tableColumns[0] = selectionColumn;
      } else {
        tableColumns.unshift(selectionColumn);
      }
    }
    return tableColumns;
  };

  renderFilterContent = filter => {
    return (
      <ul className="filterContent">
        {filter.conditions.map(condition => (
          <li
            key={condition.value}
            onClick={() => filter.onChangeFilter(condition.value)}
            className={classNames({ active: condition.value === filter.selectValue })}
          >
            {condition.name}
          </li>
        ))}
      </ul>
    );
  };

  renderFilterColumn = columns => {
    const { filterList } = this.props;
    if (filterList) {
      columns = columns.map(column => {
        const newColumn = { ...column };
        const filter = filterList.find(element => element.key === newColumn.key);
        if (filter) {
          newColumn.title = (
            <Popover content={this.renderFilterContent(filter)}>
              {newColumn.title}
              <Icon name="arrow-down" />
            </Popover>
          );
        }
        return newColumn;
      });
    }
    return columns;
  };

  renderPagination = () => {};

  renderTable = () => {
    const { ...restProps } = this.props;
    const data = this.getTableData();
    let columns = this.renderRowSelection();
    columns = this.renderFilterColumn(columns);
    columns = columns.map((column, i) => {
      const newColumn = { ...column };
      newColumn.key = column.key || column.dataIndex || i;
      return newColumn;
    });

    return <RcTable {...restProps} key="table" data={data} columns={columns} />;
  };

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.dataSource, nextProps.dataSource)) {
      this.setState({
        selectionDirty: false
      });
    }

    if (nextProps.rowSelection && nextProps.rowSelection.selectedRowKeys) {
      this.setState({
        selectedRowKeys: nextProps.rowSelection.selectedRowKeys || []
      });
    }
  }

  render() {
    const { className, style, pagination, isLoading } = this.props;

    return (
      <Loading className="loadTable" isLoading={isLoading}>
        <div className={classNames(styles.table, className)} style={style}>
          {this.renderTable()}
          {pagination && this.renderPagination}
        </div>
      </Loading>
    );
  }
}
