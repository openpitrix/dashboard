import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import { observer, inject } from 'mobx-react';

import {Button, Icon, Table} from 'components/Base';
import {Card} from 'components/Layout';
import Status from 'components/Status';
import DetailTabs from 'components/DetailTabs';
import Toolbar from 'components/Toolbar';

import ActionModal from '../../action-modal';
import columns from './columns';
import {getFilterOptions} from '../utils';

import styles from '../index.scss';

@translate()
@inject(({rootStore}) => ({
  clusterStore: rootStore.clusterStore,
  clusterDetailStore: rootStore.clusterDetailStore,
}))
@observer
export default class HelmCluster extends React.Component {
  static propTypes={
    cluster: PropTypes.object.isRequired
  }
  static defaultProps={
    cluster: {}
  }

  renderDetailTabs() {
    const {onChangeK8sTag}=this.props.clusterDetailStore;

    return (
      <DetailTabs
        tabs={['Deployment Node', 'StatefulSet Node', 'DaemonSet Node']}
        changeTab={onChangeK8sTag({
          clusterStore,
          isKubernetes
        })}
      />
    )
  }

  renderToolbar(){
    return (
      <Toolbar
        placeholder={t('Search Node')}
        searchWord={searchNode}
        onSearch={onSearchNode(isKubernetes, clusterStore)}
        onClear={onClearNode(isKubernetes, clusterStore)}
        onRefresh={onRefreshNode(isKubernetes, clusterStore)}
      />
    )
  }

  renderTable() {
    const { clusterDetailStore, clusterStore, t } = this.props;
    const clusterNodes = clusterStore.clusterNodes.toJSON();
    const { onChangeNodeStatus, selectNodeStatus, isLoading } = clusterStore;
    const { extendedRowKeys, onChangeExtend } = clusterDetailStore;

    const props = {
      isLoading,
      columns: columns(t, onChangeNodeStatus, extendedRowKeys),
      dataSource: clusterNodes,
      filterList: getFilterOptions({
        trans: t,
        onChange: onChangeExtend,
        selectValue: selectNodeStatus
      }),
      pagination: {
        tableType: 'Clusters',
        onChange: () => {},
        total: clusterNodes.length,
        current: 1
      }
    };

    props.rowKey = '';
    props.expandedRowRender = record => record.nodes.map(({ name, status, host_id, host_ip, private_ip }) => (
      <div className={styles.extendedTr} key={name}>
        <div className={styles.extendedFirstChild}/>
        <div className={styles.extendedIcon}>
          <Icon name="pods-icon"/>
        </div>
        <div>
          <div>Pods:</div>
          <div className={styles.extendedTdName}>{name}</div>
        </div>
        <div className={styles.extendedTdStatus}>
          <Status type={status} name={status}/>
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

  renderModals() {
    return (
      <div>
        {modalType === 'jobs' && this.clusterJobsModal()}
        {modalType === 'parameters' && this.clusterParametersModal()}
        <ActionModal {...actionProps} />
      </div>
    )
  }

  render(){
    return (
      <div>
        {this.renderDetailTabs()}
        <Card hasTable>
          {this.renderToolbar()}
          {this.renderTable}
        </Card>
        {this.renderModals()}
      </div>
    )
  }
}