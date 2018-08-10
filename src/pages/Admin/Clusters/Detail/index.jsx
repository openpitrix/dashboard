import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { get, capitalize } from 'lodash';
import { translate } from 'react-i18next';

import { Icon, Table, Popover, Modal } from 'components/Base';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import TdName from 'components/TdName';
import TimeAxis from 'components/TimeAxis';
import Toolbar from 'components/Toolbar';
import ClusterCard from 'components/DetailCard/ClusterCard';
import Layout, { BackBtn, Dialog, Grid, Section, Card, Panel } from 'components/Layout';
import Configuration from './Configuration';
import TimeShow from 'components/TimeShow';

import styles from './index.scss';

@translate()
@inject(({ rootStore, sock }) => ({
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore,
  runtimeStore: rootStore.runtimeStore,
  rootStore,
  sock
}))
@observer
export default class ClusterDetail extends Component {
  static async onEnter({ clusterStore, appStore, runtimeStore }, { clusterId }) {
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

  constructor(props) {
    super(props);
    props.clusterStore.loadNodeInit();
    props.clusterStore.setSocketMessage();
  }

  listenToJob = async payload => {
    const { clusterStore, match } = this.props;
    const rtype = get(payload, 'resource.rtype');
    const rid = get(payload, 'resource.rid');

    const { clusterId } = match.params;

    if (rtype === 'cluster' && rid === clusterId) {
      if (clusterStore.sockMessageChanged(payload)) {
        await clusterStore.fetch(clusterId);
        await clusterStore.fetchJobs(clusterId);
        await clusterStore.fetchNodes({ cluster_id: clusterId });
      }
      clusterStore.setSocketMessage(payload);
    }
  };

  renderHandleMenu = item => {
    const { t } = this.props;
    const { clusterParametersOpen, showOperateCluster } = this.props.clusterStore;
    const { cluster_id, status } = item;

    return (
      <div className="operate-menu">
        {/* <span onClick={clusterParametersOpen}>View Parameters</span>*/}
        <span onClick={() => showOperateCluster(cluster_id, 'delete')}>{t('Delete cluster')}</span>
        {status === 'stopped' && (
          <span onClick={() => showOperateCluster(cluster_id, 'start')}>{t('Start cluster')}</span>
        )}
        {status !== 'stopped' && (
          <span onClick={() => showOperateCluster(cluster_id, 'stop')}>{t('Stop cluster')}</span>
        )}
      </div>
    );
  };

  renderDeleteModal = () => {
    const { t } = this.props;
    const { hideModal, isModalOpen, modalType } = this.props.clusterStore;

    return (
      <Dialog
        title={t(`${capitalize(modalType)} cluster`)}
        isOpen={isModalOpen}
        onCancel={hideModal}
        onSubmit={this.handleCluster}
      >
        {t('operate cluster desc', { operate: t(capitalize(modalType)) })}
      </Dialog>
    );
  };

  handleCluster = () => {
    const { clusterStore } = this.props;
    const { clusterId, modalType } = clusterStore;
    let ids = [clusterId];
    switch (modalType) {
      case 'delete':
        clusterStore.remove(ids);
        break;
      case 'start':
        clusterStore.start(ids);
        break;
      case 'stop':
        clusterStore.stop(ids);
        break;
    }
  };

  clusterJobsModal = () => {
    const { t } = this.props;
    const { isModalOpen, hideModal } = this.props.clusterStore;
    const clusterJobs = this.props.clusterStore.clusterJobs.toJSON();

    return (
      <Dialog title={t('Activities')} isOpen={isModalOpen} onCancel={hideModal} noActions>
        <TimeAxis timeList={clusterJobs} />
      </Dialog>
    );
  };

  clusterParametersModal = () => {
    const { isModalOpen, hideModal, modalType } = this.props.clusterStore;

    return (
      <Modal
        title="Parameters"
        visible={isModalOpen && modalType === 'parameters'}
        onCancel={hideModal}
        hideFooter
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
      </Modal>
    );
  };

  render() {
    const { clusterStore, appStore, runtimeStore, t } = this.props;

    const {
      isLoading,
      searchNode,
      onSearchNode,
      onClearNode,
      onRefreshNode,
      onChangeNodeStatus,
      selectNodeStatus,
      sockMessage,
      modalType
    } = clusterStore;

    const detail = clusterStore.cluster;
    const clusterJobs = clusterStore.clusterJobs.toJSON();
    const clusterNodes = clusterStore.clusterNodes.toJSON();
    const appName = get(appStore.appDetail, 'name', '');
    const runtimeName = get(runtimeStore.runtimeDetail, 'name', '');
    const provider = get(runtimeStore.runtimeDetail, 'provider', '');
    const { clusterJobsOpen } = clusterStore;

    const columns = [
      {
        title: t('Name'),
        key: 'name',
        width: '155px',
        render: item => <TdName name={item.name} description={item.node_id} noIcon />
      },
      {
        title: t('Role'),
        key: 'role',
        dataIndex: 'role'
      },
      {
        title: t('Status'),
        key: 'status',
        width: '102px',
        // fixme: prop type check case sensitive
        render: item => <Status type={(item.status + '').toLowerCase()} name={item.status} />
      },
      {
        title: t('Configuration'),
        key: 'configuration',
        width: '100px',
        render: item => <Configuration configuration={item.cluster_role || {}} />
      },
      {
        title: t('Private IP'),
        key: 'private_ip',
        dataIndex: 'private_ip',
        width: '95px'
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '95px',
        render: item => <TimeShow time={item.status_time} />
      }
    ];
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

    return (
      <Layout
        backBtn={<BackBtn label="clusters" link="/dashboard/clusters" />}
        isloading={isLoading}
        sockMessage={sockMessage}
        listenToJob={this.listenToJob}
      >
        <Grid>
          <Section>
            <Card>
              <ClusterCard
                detail={detail}
                appName={appName}
                runtimeName={runtimeName}
                provider={provider}
              />
              {detail.status !== 'deleted' && (
                <Popover className="operation" content={this.renderHandleMenu(detail)}>
                  <Icon name="more" />
                </Popover>
              )}
            </Card>
            <Card className={styles.activities}>
              <div className={styles.title}>
                {t('Activities')}
                <div className={styles.more} onClick={clusterJobsOpen}>
                  {t('More')} →
                </div>
              </div>
              <TimeAxis timeList={clusterJobs.splice(0, 4)} />
            </Card>
          </Section>

          <Section size={8}>
            <Panel>
              <TagNav tags={['Nodes']} />

              <Card>
                <Toolbar
                  placeholder={t('Search Node')}
                  searchWord={searchNode}
                  onSearch={onSearchNode}
                  onClear={onClearNode}
                  onRefresh={onRefreshNode}
                />
                <Table
                  columns={columns}
                  dataSource={clusterNodes}
                  isLoading={isLoading}
                  filterList={filterList}
                  pagination={pagination}
                />
              </Card>
              {modalType === 'jobs' && this.clusterJobsModal()}
              {modalType === 'parameters' && this.clusterParametersModal()}
              {['delete', 'start', 'stop'].includes(modalType) && this.renderDeleteModal()}
            </Panel>
          </Section>
        </Grid>
      </Layout>
    );
  }
}
