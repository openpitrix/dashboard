import React from 'react';
import RcTable from 'rc-table';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEqual } from 'lodash';

import {
  Checkbox, Radio, Popover, Icon, Pagination
} from 'components/Base';
import Loading from 'components/Loading';
import NoData from './noData';

import styles from './index.scss';

export default class Table extends React.Component {
  static propTypes = {
    columns: PropTypes.array,
    dataSource: PropTypes.array,
    filterList: PropTypes.array,
    isLoading: PropTypes.bool,
    pagination: PropTypes.object,
    prefixCls: PropTypes.string,
    rowSelection: PropTypes.object
  };

  static defaultProps = {
    prefixCls: 'pi-table',
    dataSource: [],
    columns: [],
    pagination: {},
    rowKey: 'key',
    rowSelection: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: (props.rowSelection || {}).selectedRowKeys || [],
      selectionDirty: false,
      reverse: true
    };
  }

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

  getTableData = () => {
    const { rowKey } = this.props;
    const data = [...this.props.dataSource];

    data.map((item, i) => {
      if (!item[rowKey]) {
        item[rowKey] = item.id || rowKey + i;
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

  getDefaultSelection = () => this.getTableData()
    .filter(item => item.checked)
    .map((item, i) => this.getItemKey(item, i));

  setSelectedRowKeys = (
    selectedRowKeys,
    {
      selectType, item, checked, changeRowKeys
    }
  ) => {
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

  setExtendRowKeys = () => {
    /* const { extendRowSelection } = this.props; */
  };

  handleCheckboxSelect = (value, index, e) => {
    const { rowKey } = this.props;
    const checked = e.target.checked;
    const defaultSelection = this.state.selectionDirty
      ? []
      : this.getDefaultSelection();
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
    const defaultSelection = this.state.selectionDirty
      ? []
      : this.getDefaultSelection();
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
        checked={
          this.state.selectedRowKeys.indexOf(value[this.props.rowKey]) !== -1
        }
        onChange={handleChange}
      />
    );
  };

  renderRowSelection = () => {
    const { rowSelection, columns } = this.props;
    const tableColumns = [...columns];

    if (rowSelection.selectedRowKeys) {
      const data = this.getTableData();
      const selectionColumn = {
        key: 'selection-column',
        width: '30px',
        render: this.renderSelectionBox(rowSelection.type),
        className: styles.selectionColumn,
        fixed: rowSelection.fixed
      };

      if (rowSelection.type === 'radio') {
        selectionColumn.title = '';
      } else {
        const allChecked = data.length
          ? data.every(
            (item, i) => this.state.selectedRowKeys.indexOf(this.getItemKey(item, i))
                !== -1
          )
          : false;
        selectionColumn.title = (
          <Checkbox checked={allChecked} onChange={this.handleSelectAll} />
        );
      }

      if (tableColumns[0] && tableColumns[0].key === 'selection-column') {
        tableColumns[0] = selectionColumn;
      } else {
        tableColumns.unshift(selectionColumn);
      }
    }
    return tableColumns;
  };

  renderFilterContent = filter => (
    <ul className="filterContent">
      {filter.conditions.map(condition => (
        <li
          key={condition.value}
          onClick={() => filter.onChangeFilter(condition.value)}
          className={classNames({
            active: condition.value === filter.selectValue
          })}
        >
          {condition.name}
        </li>
      ))}
    </ul>
  );

  renderFilterColumn = columns => {
    const { filterList } = this.props;
    if (filterList) {
      columns = columns.map(column => {
        const newColumn = { ...column };
        const filter = filterList.find(
          element => element.key === newColumn.key
        );
        if (filter) {
          newColumn.title = (
            <Popover
              content={this.renderFilterContent(filter)}
              className={styles.filterOuter}
            >
              {newColumn.title}
              <Icon
                name="caret-down"
                type={`${filter.selectValue ? 'light' : 'dark'}`}
              />
            </Popover>
          );
        }
        return newColumn;
      });
    }
    return columns;
  };

  rowClassName = (record, index) => {
    let { selectedRowKeys } = this.state;
    if ('toJSON' in selectedRowKeys) {
      selectedRowKeys = selectedRowKeys.toJSON();
    }
    if (selectedRowKeys.includes(index)) {
      return 'row-selected';
    }
    return '';
  };

  renderTable = () => {
    const { pagination, ...restProps } = this.props;
    const data = this.getTableData();
    let columns = this.renderRowSelection();
    columns = this.renderFilterColumn(columns);
    columns = columns.map((column, i) => {
      const newColumn = { ...column };
      newColumn.key = column.key || column.dataIndex || i;
      if (newColumn.sorter) {
        const { reverse } = this.state;
        const onChangeSort = () => {
          this.setState({
            reverse: !reverse
          });
          column.onChangeSort({
            sort_key: column.key,
            reverse
          });
        };
        newColumn.title = (
          <span onClick={() => onChangeSort()} className={styles.sortOuter}>
            {newColumn.title}
            <Icon name={`sort-${reverse ? 'ascend' : 'descend'}ing`} />
          </span>
        );
      }
      return newColumn;
    });

    return (
      <RcTable
        {...restProps}
        key="table"
        data={data}
        columns={columns}
        emptyText={<NoData type={pagination.tableType} />}
        rowClassName={this.rowClassName}
      />
    );
  };

  render() {
    const {
      className,
      style,
      pagination,
      isLoading,
      rowSelection
    } = this.props;
    const { selectedRowKeys } = this.state;

    if (isLoading) {
      return <Loading className="loadTable" isLoading={isLoading} />;
    }

    return (
      <Loading className="loadTable" isLoading={isLoading}>
        <div className={classNames(styles.table, className)} style={style}>
          {this.renderTable()}
          <Pagination
            {...pagination}
            selectedRows={selectedRowKeys}
            onSelectRow={rowSelection.onChange}
          />
        </div>
      </Loading>
    );
  }
}
