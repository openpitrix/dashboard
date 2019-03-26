import React from 'react';
import RcTable from 'rc-table';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _, { isEqual, find } from 'lodash';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { obj2Qs, qs2Obj } from 'utils';

import {
  Checkbox, Radio, Popover, Icon, Pagination
} from 'components/Base';
import Loading from 'components/Loading';
import NoData from './noData';

import styles from './index.scss';

@withTranslation()
export class Table extends React.Component {
  static propTypes = {
    columns: PropTypes.array,
    dataSource: PropTypes.array,
    filterList: PropTypes.array,
    isLoading: PropTypes.bool,
    noPagination: PropTypes.bool,
    pagination: PropTypes.object,
    prefixCls: PropTypes.string,
    rowSelection: PropTypes.shape({
      selectedRowKeys: PropTypes.array,
      onChange: PropTypes.func,
      onSelect: PropTypes.func,
      onSelectAll: PropTypes.func
    })
  };

  static defaultProps = {
    prefixCls: 'pi-table',
    dataSource: [],
    columns: [],
    pagination: {},
    rowKey: 'key',
    noPagination: false,
    rowSelection: {
      // selectedRowKeys: [],
      onChange: _.noop,
      onSelect: _.noop,
      onSelectAll: _.noop
    },
    filterList: [],
    isLoading: false
  };

  constructor(props) {
    super(props);

    const { location } = props;
    const values = qs2Obj(location.search);
    const reverse = values.reverse !== '0';
    this.state = {
      selectedRowKeys: (props.rowSelection || {}).selectedRowKeys || [],
      selectionDirty: false,
      sort_key: values.sort_key,
      reverse
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
    const { reverse, sort_key } = this.state;
    const order = reverse ? 'desc' : 'asc';
    const data = _.orderBy(this.props.dataSource, sort_key, order);

    return data.map((item, i) => {
      if (!item[rowKey]) {
        item[rowKey] = item.id || rowKey + i;
      }
      return item;
    });
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
      e.preventDefault();
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

  renderHeaderColumns = () => {
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

  renderFilterContent = filter => {
    const { t } = this.props;

    return (
      <ul className="filterContent">
        {filter.conditions.map(condition => (
          <li
            key={condition.value}
            onClick={() => filter.onChangeFilter(condition.value)}
            className={classNames({
              active: condition.value === filter.selectValue
            })}
          >
            {t(condition.name)}
          </li>
        ))}
      </ul>
    );
  };

  trans = key => {
    if (typeof key === 'string') {
      return this.props.t(key);
    }
    return key;
  };

  handleSort = (cb, column) => {
    const sort_key = column.key || column.dataIndex;
    this.setState(
      {
        sort_key,
        reverse: !this.state.reverse
      },
      () => {
        const { reverse } = this.state;
        const { history, location } = this.props;
        const values = qs2Obj(location.search);
        values.reverse = reverse ? 1 : 0;
        values.sort_key = sort_key;
        history.push({
          search: obj2Qs(values)
        });

        typeof cb === 'function'
          && cb({
            sort_key: column.key || column.dataIndex,
            reverse
          });
      }
    );
  };

  filterColumns = columns => {
    const { filterList, t } = this.props;
    const { reverse } = this.state;

    return columns.map(({ ...column }) => {
      const filter = find(filterList, { key: column.key });

      if (filter) {
        column.title = (
          <Popover
            content={this.renderFilterContent(filter)}
            className={styles.filterOuter}
          >
            {this.trans(column.title)}
            <Icon
              name="caret-down"
              type={`${filter.selectValue ? 'light' : 'dark'}`}
              size={12}
            />
          </Popover>
        );
      } else if (typeof column.title === 'string') {
        // won't call translate helper in columns file
        column.title = t(column.title);
      }

      // is col can be sorted?
      if (column.sorter) {
        column.title = (
          <span
            onClick={() => this.handleSort(column.onChangeSort, column)}
            className={styles.sortOuter}
          >
            {column.title}
            <Icon name={`sort-${reverse ? 'descend' : 'ascend'}ing`} />
          </span>
        );
      }

      return column;
    });
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
    let columns = this.renderHeaderColumns();
    columns = this.filterColumns(columns);

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
      rowSelection,
      noPagination
    } = this.props;
    const { selectedRowKeys } = this.state;

    return (
      <div className={classNames(styles.table, className)} style={style}>
        <Loading isLoading={isLoading}>
          {this.renderTable()}
          {!noPagination && (
            <Pagination
              {...pagination}
              selectedRows={selectedRowKeys}
              onSelectRow={rowSelection.onChange}
            />
          )}
        </Loading>
      </div>
    );
  }
}

export default withRouter(Table);
