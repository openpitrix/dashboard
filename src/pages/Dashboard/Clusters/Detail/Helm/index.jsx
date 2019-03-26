import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';

import { Icon, Table } from 'components/Base';
import { Card, Dialog } from 'components/Layout';
import Status from 'components/Status';
import DetailTabs from 'components/DetailTabs';
import Toolbar from 'components/Toolbar';
import NoData from 'components/Base/Table/noData';
import CodeMirror from 'components/CodeMirror';

import columns from './columns';
import { getFilterOptions } from '../utils';

import styles from '../index.scss';

@withTranslation()
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

  handleUpdateEnv = async () => {
    const { clusterStore, clusterDetailStore } = this.props;
    const { changedEnv, env, formatEnv } = clusterDetailStore;

    if (!changedEnv || changedEnv === env) {
      clusterStore.info('Data not changed');
      return;
    }

    await clusterStore.doActions({ env: formatEnv(changedEnv || env) });
  };

  renderDetailTabs() {
    const { onChangeK8sTag } = this.props.clusterDetailStore;

    return (
      <DetailTabs
        tabs={[
          'Deployment Pods',
          'StatefulSet Pods',
          'DaemonSet Pods',
          'Additional Info'
        ]}
        changeTab={onChangeK8sTag}
      />
    );
  }

  renderToolbar() {
    const { clusterDetailStore, t } = this.props;
    const {
      nodeType,
      searchNode,
      onSearchNode,
      onClearNode,
      onRefreshNode
    } = clusterDetailStore;

    if (nodeType === 'Additional') {
      return null;
    }

    return (
      <Toolbar
        className={styles.toolbar}
        placeholder={t(`Search ${nodeType} Pods`)}
        searchWord={searchNode}
        onSearch={onSearchNode}
        onClear={onClearNode}
        onRefresh={onRefreshNode}
      />
    );
  }

  renderTable() {
    const { clusterDetailStore, t } = this.props;
    const { isLoading } = clusterDetailStore;
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
    props.expandedRowRender = record => record.nodes.map(({
      name, status, host_id, host_ip, private_ip
    }) => (
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

    return <Table isLoading={isLoading} {...props} />;
  }

  renderAdditionInfo() {
    const { clusterDetailStore, t } = this.props;
    const additionalInfo = _.get(clusterDetailStore, 'cluster.additional_info');
    if (!additionalInfo) return <NoData type="Clusters" />;

    const info = JSON.parse(additionalInfo);

    const renderTable = key => {
      if (_.get(info, `${key}.length`) === 0) {
        return null;
      }
      const props = {
        columns: _.keys(_.first(info[key])).map(tableKey => ({
          title: t(tableKey),
          key: tableKey,
          render: item => <div>{item[tableKey]}</div>
        })),
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

    return _.keys(info).map(key => renderTable(key));
  }

  renderModals() {
    const { clusterStore, clusterDetailStore, t } = this.props;
    const { modalType, isModalOpen } = clusterStore;

    if (modalType === 'update_env') {
      const {
        changeEnv,
        env,
        changedEnv,
        cancelChangeEnv,
        formatEnv
      } = clusterDetailStore;

      return (
        <Dialog
          width={744}
          title={t(`Update cluster env`)}
          isOpen={isModalOpen}
          onCancel={cancelChangeEnv}
          onSubmit={this.handleUpdateEnv}
        >
          <CodeMirror
            code={formatEnv(changedEnv || env)}
            onChange={changeEnv}
            mode="yaml"
          />
        </Dialog>
      );
    }
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
