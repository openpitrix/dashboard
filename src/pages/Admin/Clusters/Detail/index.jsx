import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { get } from 'lodash';

import { Icon, Input, Button, Table, Pagination, Popover, Modal } from 'components/Base';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import TdName from 'components/TdName';
import TimeAxis from 'components/TimeAxis';
import ClusterCard from 'components/DetailCard/ClusterCard';
import Layout, { BackBtn, Dialog } from 'components/Layout/Admin';
import { LayoutLeft, LayoutRight } from 'components/Layout';
import Configuration from './Configuration';
import TimeShow from 'components/TimeShow';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore,
  runtimeStore: rootStore.runtimeStore
}))
@observer
export default class ClusterDetail extends Component {
  static async onEnter({ clusterStore, appStore, runtimeStore }, { clusterId }) {
    clusterStore.searchNode = '';
    await clusterStore.fetch(clusterId);
    await clusterStore.fetchJobs(clusterId);
    await clusterStore.fetchNodes({ cluster_id: clusterId });
    const { cluster } = clusterStore;
    if (cluster.app_id) {
      await appStore.fetch(cluster.app_id);
    }
    if (cluster.runtime_id) {
      await runtimeStore.fetch(cluster.runtime_id);
    }
  }

  renderHandleMenu = () => {
    const { clusterParametersOpen } = this.props.clusterStore;

    return (
      <div className="operate-menu">
        <span onClick={clusterParametersOpen}>View Parameters</span>
      </div>
    );
  };

  clusterJobsModal = () => {
    const { isModalOpen, hideModal, modalType } = this.props.clusterStore;
    const clusterJobs = this.props.clusterStore.clusterJobs.toJSON();

    return (
      <Modal width={744} title="Activities" visible={isModalOpen} hideFooter onCancel={hideModal}>
        <TimeAxis timeList={clusterJobs} />
      </Modal>
    );
  };

  clusterParametersModal = () => {
    const { isModalOpen, hideModal, modalType } = this.props.clusterStore;

    return (
      <Dialog
        title="Parameters"
        onCancel={hideModal}
        noActions
        isOpen={isModalOpen && modalType === 'parameters'}
        width={744}
      >
        <ul className={styles.parameters}>
          <li>
            <div className={styles.name}>Port</div>
            <div className={styles.info}>
              <p className={styles.value}>3306</p>
              <p className={styles.explain}>
                Range: 3306－65535, The Esgyn will restart if modified.
              </p>
            </div>
          </li>
          <li>
            <div className={styles.name}>Character_set_server</div>
            <div className={styles.info}>
              <p className={styles.value}>utf8</p>
            </div>
          </li>
          <li>
            <div className={styles.name}>Intractive_timeout</div>
            <div className={styles.info}>
              <p className={styles.value}>3600</p>
            </div>
          </li>
          <li>
            <div className={styles.name}>Back_log</div>
            <div className={styles.info}>
              <p className={styles.value}>3600</p>
              <p className={styles.explain}>
                Range: 50－4096, The EsgynDB will restart if modified.
              </p>
            </div>
          </li>
          <li>
            <div className={styles.name}>Expire_logs_days</div>
            <div className={styles.info}>
              <p className={styles.value}>1</p>
              <p className={styles.explain}>Range: 0－14</p>
            </div>
          </li>
          <li>
            <div className={styles.name}>FT_min_word_len</div>
            <div className={styles.info}>
              <p className={styles.value}>4</p>
              <p className={styles.explain}>Range: 0－14, The EsgynDB will restart if modified.</p>
            </div>
          </li>
          <li>
            <div className={styles.name}>Key_buffer_size</div>
            <div className={styles.info}>
              <p className={styles.value}>33554432</p>
            </div>
          </li>
          <li>
            <div className={styles.name}>Log_bin_function_trust_creators</div>
            <div className={styles.info}>
              <p className={styles.value}>1</p>
              <p className={styles.explain}>Range: 0－1</p>
            </div>
          </li>
          <li>
            <div className={styles.name}>Long_query_time</div>
            <div className={styles.info}>
              <p className={styles.value}>3</p>
              <p className={styles.explain}>Range: 0－300</p>
            </div>
          </li>
          <li>
            <div className={styles.name}>Lower_case_table_names</div>
            <div className={styles.info}>
              <p className={styles.value}>1</p>
              <p className={styles.explain}>Range: 0－1, The EsgynDB will restart if modified.</p>
            </div>
          </li>
        </ul>
      </Dialog>
    );
  };

  render() {
    const { clusterStore, appStore, runtimeStore } = this.props;
    const {
      isLoading,
      searchNode,
      onSearchNode,
      onClearNode,
      onRefreshNode,
      onChangeNodeStatus,
      selectNodeStatus
    } = clusterStore;
    const detail = clusterStore.cluster;
    const clusterJobs = clusterStore.clusterJobs.toJSON();
    const clusterNodes = clusterStore.clusterNodes.toJSON();
    const appName = get(appStore.appDetail, 'name', '');
    const runtimeName = get(runtimeStore.runtimeDetail, 'name', '');
    const { clusterJobsOpen } = clusterStore;

    const columns = [
      {
        title: 'Name',
        key: 'name',
        width: '170px',
        render: item => <TdName name={item.name} description={item.node_id} />
      },
      {
        title: 'Role',
        key: 'role',
        dataIndex: 'role'
      },
      {
        title: 'Node Status',
        key: 'status',
        width: '130px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: 'Configuration',
        key: 'configuration',
        width: '120px',
        render: item => <Configuration configuration={item.cluster_role || {}} />
      },
      {
        title: 'Private IP',
        key: 'private_ip',
        dataIndex: 'private_ip'
      },
      {
        title: 'Updated At',
        key: 'status_time',
        width: '120px',
        render: item => <TimeShow time={item.status_time} />
      }
    ];
    const tags = [{ id: 1, name: 'Nodes' }];
    const curTag = 'Nodes';
    const filterList = [
      {
        key: 'status',
        conditions: [
          { name: 'Active', value: 'active' },
          { name: 'Stopped', value: 'stopped' },
          { name: 'Ceased', value: 'ceased' },
          { name: 'Pending', value: 'pending' },
          { name: 'Suspended', value: 'suspended' },
          { name: 'Deleted', value: 'deleted' }
        ],
        onChangeFilter: onChangeNodeStatus,
        selectValue: selectNodeStatus
      }
    ];

    return (
      <Layout>
        <BackBtn label="clusters" link="/dashboard/clusters" />

        <LayoutLeft>
          <div className="detail-outer">
            <ClusterCard detail={detail} appName={appName} runtimeName={runtimeName} />
            <Popover className="operation" content={this.renderHandleMenu()}>
              <Icon name="more" />
            </Popover>
          </div>

          <div className={styles.activities}>
            <div className={styles.title}>
              Activities
              <div className={styles.more} onClick={clusterJobsOpen}>
                More →
              </div>
            </div>
            <TimeAxis timeList={clusterJobs.splice(0, 4)} />
          </div>
        </LayoutLeft>

        <LayoutRight className="table-outer">
          <TagNav tags={tags} curTag={curTag} />
          <div className="toolbar">
            <Input.Search
              placeholder="Search Node Name"
              value={searchNode}
              onSearch={onSearchNode}
              onClear={onClearNode}
              maxLength="50"
            />
            <Button className="f-right" onClick={onRefreshNode}>
              <Icon name="refresh" size="mini" />
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={clusterNodes}
            isLoading={isLoading}
            filterList={filterList}
          />
          <div className={styles.total}>Total: {clusterNodes.length}</div>
        </LayoutRight>

        {this.clusterJobsModal()}
        {this.clusterParametersModal()}
      </Layout>
    );
  }
}
