import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { observer, inject } from 'mobx-react';
import { get, keys, reduce, first } from 'lodash';

import { Button, Icon, Table } from 'components/Base';
import { Card } from 'components/Layout';
import Status from 'components/Status';
import DetailTabs from 'components/DetailTabs';
import Toolbar from 'components/Toolbar';

import columns from './columns';
import { getFilterOptions } from '../utils';

import styles from '../index.scss';

@translate()
@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore,
  clusterDetailStore: rootStore.clusterDetailStore
}))
@observer
export default class HelmCluster extends React.Component {
  static propTypes = {
    cluster: PropTypes.object.isRequired
  };
  static defaultProps = {
    cluster: {}
  };

  constructor(props) {
    super(props);

    props.clusterDetailStore.clusterStore = props.clusterStore;
  }

  renderDetailTabs() {
    const { onChangeK8sTag } = this.props.clusterDetailStore;

    return (
      <DetailTabs
        tabs={['Deployment Pods', 'StatefulSet Pods', 'DaemonSet Pods', 'Additional Info']}
        changeTab={onChangeK8sTag}
      />
    );
  }

  renderToolbar() {
    const { clusterDetailStore, t } = this.props;
    const { nodeType, searchNode, onSearchNode, onClearNode, onRefreshNode } = clusterDetailStore;

    if (nodeType === 'Additional') {
      return null;
    }

    return (
      <Toolbar
        placeholder={t('Search Node')}
        searchWord={searchNode}
        onSearch={onSearchNode}
        onClear={onClearNode}
        onRefresh={onRefreshNode}
      />
    );
  }

  renderTable() {
    const { clusterDetailStore, t } = this.props;
    const clusterNodes = clusterDetailStore.helmClusterNodes.toJSON();

    const {
      nodeType,
      onChangeNodeStatus,
      selectNodeStatus,
      extendedRowKeys,
      onChangeExtend,
      changePaginationNode,
      totalNodeCount
    } = clusterDetailStore;

    const props = {
      columns: columns(t, onChangeExtend, extendedRowKeys),
      dataSource: clusterNodes,
      filterList: getFilterOptions({
        trans: t,
        onChange: onChangeNodeStatus,
        selectValue: selectNodeStatus
      }),
      pagination: {
        tableType: 'Clusters',
        onChange: changePaginationNode,
        total: totalNodeCount,
        current: 1
      }
    };

    if (nodeType === 'Additional') {
      return this.renderAdditionInfo();
    }

    props.rowKey = '';
    props.expandedRowRender = record =>
      record.nodes.map(({ name, status, host_id, host_ip, private_ip }) => (
        <div className={styles.extendedTr} key={name}>
          <div className={styles.extendedFirstChild} />
          <div className={styles.extendedIcon}>
            <Icon name="pods-icon" />
          </div>
          <div>
            <div>Pods:</div>
            <div className={styles.extendedTdName}>{name}</div>
          </div>
          <div className={styles.extendedTdStatus}>
            <Status type={status} name={status} />
          </div>
          <div className={styles.extendedFlex}>
            <div>Instance:</div>
            <div>{`${host_id} ${host_ip}`}</div>
          </div>
          <div className={styles.extendedFlex}>
            <div>IP:</div>
            <div>{private_ip}</div>
          </div>
        </div>
      ));

    props.expandedRowKeys = extendedRowKeys.toJSON();
    props.expandedRowClassName = () => styles.extendedRow;
    props.className = styles.table;

    return <Table {...props} />;
  }

  renderAdditionInfo() {
    const { clusterDetailStore, t } = this.props;
    const additionalInfo = get(clusterDetailStore, 'cluster.additional_info');
    if (!additionalInfo) return null;

    const info = JSON.parse(additionalInfo);

    const renderTable = key => {
      if (get(info, `${key}.length`) === 0) {
        return null;
      }
      const columns = keys(first(info[key])).map(tableKey => ({
        title: t(tableKey),
        key: tableKey,
        render: item => <div>{item[tableKey]}</div>
      }));
      const props = {
        columns,
        dataSource: info[key],
        pagination: {
          total: 0
        }
      };
      return (
        <div key={key}>
          <h3 className={styles.additionalTitle}>{key}</h3>
          <Table className={styles.additionalTable} {...props} />
        </div>
      );
    };

    return keys(info).map(key => renderTable(key));
  }

  renderModals() {
    //
  }

  render() {
    return (
      <div>
        {this.renderDetailTabs()}
        <Card hasTable>
          {this.renderToolbar()}
          {this.renderTable()}
        </Card>
        {this.renderModals()}
      </div>
    );
  }
}
