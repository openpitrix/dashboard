import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Table } from 'components/Base';

import defaultColumns from './columns';
import defaultFilters from './filters';

export default class AppsTable extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    columns: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
    columnsFilter: PropTypes.func,
    data: PropTypes.array,
    filterList: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
    inject: PropTypes.object,
    isLoading: PropTypes.bool,
    selectionType: PropTypes.string,
    store: PropTypes.shape({
      selectedRowKeys: PropTypes.array,
      selectIds: PropTypes.array,
      selectStatus: PropTypes.string,
      searchWord: PropTypes.string,
      totalCount: PropTypes.number,
      currentPage: PropTypes.number,
      onChangeSelect: PropTypes.func,
      onChangeStatus: PropTypes.func,
      changePagination: PropTypes.func
    }).isRequired,
    tableType: PropTypes.string
  };

  static defaultProps = {
    store: {
      selectedRowKeys: [],
      onChangeSelect: _.noop,
      onChangeStatus: _.noop,
      selectStatus: '',
      changePagination: _.noop,
      totalCount: 0,
      currentPage: 1
    },
    data: [],
    columns: [],
    columnsFilter: x => x,
    selectionType: 'checkbox',
    tableType: 'Apps',
    filterList: [],
    inject: {}
  };

  render() {
    const {
      data,
      store,
      columns,
      columnsFilter,
      inject,
      filterList,
      selectionType,
      tableType,
      isLoading,
      className
    } = this.props;

    const rowSelection = {
      type: selectionType,
      selectedRowKeys: store.selectedRowKeys,
      onChange: store.onChangeSelect
    };

    const pagination = {
      tableType,
      onChange: store.changePagination,
      total: store.totalCount,
      current: store.currentPage,
      noCancel: false
    };

    let normalizeCols = _.isEmpty(columns) ? defaultColumns : columns;

    if (_.isFunction(normalizeCols)) {
      normalizeCols = normalizeCols(inject);
    }

    return (
      <Table
        className={className}
        isLoading={isLoading}
        columns={columnsFilter(normalizeCols)}
        dataSource={data.slice(0, store.pageSize || 10)}
        rowSelection={rowSelection}
        filterList={
          _.isEmpty(filterList)
            ? defaultFilters(store.onChangeStatus, store.selectStatus)
            : filterList
        }
        pagination={pagination}
      />
    );
  }
}
