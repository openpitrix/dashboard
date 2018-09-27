import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import { Table } from 'components/Base';
import getColumns from './columns';
import styles from './index.scss';
import ExtendedRow from './ExtendedRow';

@observer
export default class ClusterNodesTable extends Component {
  render() {
    const { runtimeStore, clusterDetailStore, clusterStore, t } = this.props;
    const clusterNodes = clusterStore.clusterNodes.toJSON();
    const { isKubernetes } = runtimeStore;
    const { onChangeNodeStatus, selectNodeStatus, isLoading } = clusterStore;
    const { extendedRowKeys } = clusterDetailStore;

    const filterList = [
      {
        key: 'status',
        conditions: [
          { name: t('Pending'), value: 'pending' },
          { name: t('Active'), value: 'active' },
          { name: t('Stopped'), value: 'stopped' },
          { name: t('Suspended'), value: 'suspended' },
          { name: t('Deleted'), value: 'deleted' },
          { name: t('Ceased'), value: 'ceased' }
        ],
        onChangeFilter: onChangeNodeStatus,
        selectValue: selectNodeStatus
      }
    ];

    const pagination = {
      tableType: 'Clusters',
      onChange: () => {},
      total: clusterNodes.length,
      current: 1
    };

    const columns = getColumns({
      isKubernetes,
      clusterStore,
      clusterDetailStore,
      renderHandleMenu: this.renderHandleMenu,
      t
    });
    const props = {
      columns,
      dataSource: clusterNodes,
      isLoading,
      filterList,
      pagination
    };
    if (isKubernetes) {
      props.rowKey = '';
      props.expandedRowRender = record =>
        record.nodes.map(item => <ExtendedRow key={item.name} {...item} />);
      props.expandedRowKeys = extendedRowKeys.toJS();
      props.expandedRowClassName = () => styles.extendedRow;
      props.className = styles.table;
    }
    return <Table {...props} />;
  }
}
