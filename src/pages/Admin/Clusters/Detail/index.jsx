import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import { Icon, Table, Popover, Modal, Button, Input, Radio } from 'components/Base';
import Layout, { BackBtn, Dialog, Grid, Section, Card, Panel, NavLink } from 'components/Layout';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import TdName from 'components/TdName';
import TimeAxis from 'components/TimeAxis';
import Toolbar from 'components/Toolbar';
import ClusterCard from 'components/DetailCard/ClusterCard';
import Configuration from './Configuration';
import TimeShow from 'components/TimeShow';
import { getSessInfo } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore, sessInfo }) => ({
  clusterStore: rootStore.clusterStore,
  appStore: rootStore.appStore,
  runtimeStore: rootStore.runtimeStore,
  rootStore,
  sessInfo
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
    this.clusterId = _.get(props.match, 'params.clusterId');
    this.props.clusterStore.loadNodeInit();
  }

  listenToJob = async ({ op, rtype, rid, values = {} }) => {
    const { clusterStore, match } = this.props;
    const { clusterId } = match.params;
    const { jobs } = clusterStore;

    const status = _.pick(values, ['status', 'transition_status']);
    const logJobs = () => clusterStore.info(`${op}: ${rid}, ${JSON.stringify(status)}`);

    if (op === 'create:job' && values.cluster_id === clusterId) {
      // new job
      jobs[rid] = clusterId;
      await clusterStore.fetchJobs(clusterId);
      logJobs();
    }

    // job updated
    if (op === 'update:job' && jobs[rid] === clusterId) {
      if (['successful', 'failed'].includes(status.status)) {
        // assume job is done
        await clusterStore.fetch(clusterId);
        await clusterStore.fetchJobs(clusterId);
        await clusterStore.fetchNodes({ cluster_id: clusterId });
        delete jobs[rid];
      }

      logJobs();
    }

    if (rtype === 'cluster' && rid === clusterId) {
      Object.assign(clusterStore.cluster, status);
    }

    if (rtype === 'cluster_node') {
      let curNodes = clusterStore.clusterNodes.toJSON().map(node => node.node_id);

      if (curNodes.includes(rid)) {
        clusterStore.clusterNodes = clusterStore.clusterNodes.map(node => {
          if (node.node_id === rid) {
            Object.assign(node, status);
          }
          return node;
        });
      }
    }
  };

  handleOperateCluster = () => {
    const { clusterStore } = this.props;
    const { clusterId, modalType } = clusterStore;

    try {
      clusterStore[modalType === 'delete' ? 'remove' : modalType]([clusterId]);
    } catch (err) {}
  };

  handleClickAddNodes = () => {
    this.props.clusterStore.showModal('addNodes');
  };

  handleClickDeleteNodes = () => {
    this.props.clusterStore.showModal('deleteNodes');
  };

  handleAddNodes = async (e, formData) => {
    const { selectedNodeRole, addNodes } = this.props.clusterStore;

    formData = _.extend(_.pick(formData, ['node_count', 'advanced_params']), {
      cluster_id: this.clusterId,
      role: selectedNodeRole
    });

    formData.node_count = parseInt(formData.node_count);

    await addNodes(formData);
  };

  handleDeleteNodes = async () => {
    const { deleteNodes, selectedNodeIds } = this.props.clusterStore;

    await deleteNodes({
      cluster_id: this.clusterId,
      node_id: selectedNodeIds,
      advanced_params: [] // todo
    });
  };

  renderHandleMenu = item => {
    const { t } = this.props;
    const { showOperateCluster } = this.props.clusterStore;
    const { cluster_id, status } = item;

    return (
      <div className="operate-menu">
        {status === 'stopped' && (
          <span onClick={() => showOperateCluster(cluster_id, 'start')}>{t('Start cluster')}</span>
        )}
        {status !== 'stopped' && (
          <span onClick={() => showOperateCluster(cluster_id, 'stop')}>{t('Stop cluster')}</span>
        )}
        <span onClick={() => showOperateCluster(cluster_id, 'resize')}>{t('Resize cluster')}</span>
        <span onClick={() => showOperateCluster(cluster_id, 'delete')}>{t('Delete cluster')}</span>
      </div>
    );
  };

  renderOperationModal = () => {
    const { t } = this.props;
    const { hideModal, isModalOpen, modalType } = this.props.clusterStore;

    return (
      <Dialog
        title={t(`${_.capitalize(modalType)} cluster`)}
        isOpen={isModalOpen}
        onCancel={hideModal}
        onSubmit={this.handleOperateCluster}
      >
        {t('operate cluster desc', { operate: t(_.capitalize(modalType)) })}
      </Dialog>
    );
  };

  renderJobsModal = () => {
    const { t } = this.props;
    const { isModalOpen, hideModal } = this.props.clusterStore;
    const clusterJobs = this.props.clusterStore.clusterJobs.toJSON();

    return (
      <Dialog title={t('Activities')} isOpen={isModalOpen} onCancel={hideModal} noActions>
        <TimeAxis timeList={clusterJobs} />
      </Dialog>
    );
  };

  renderParametersModal = () => {
    const { isModalOpen, hideModal, modalType } = this.props.clusterStore;

    return (
      <Modal
        title="Parameters"
        visible={isModalOpen && modalType === 'parameters'}
        onCancel={hideModal}
        hideFooter
      >
        <ul className={styles.parameters}>
          {/*<li>*/}
          {/*<div className={styles.name}>Port</div>*/}
          {/*<div className={styles.info}>*/}
          {/*<p className={styles.value}>3306</p>*/}
          {/*<p className={styles.explain}>*/}
          {/*Range: 3306－65535, The Esgyn will restart if modified.*/}
          {/*</p>*/}
          {/*</div>*/}
          {/*</li>*/}
        </ul>
      </Modal>
    );
  };

  renderResizeClusterModal = () => {
    const { clusterStore, t } = this.props;
    const { isModalOpen, hideResizeClusterModal } = clusterStore;

    // todo
    return (
      <Dialog
        title={t(`Resize cluster`)}
        isOpen={isModalOpen}
        onCancel={hideResizeClusterModal}
        onSubmit={_.noop}
      >
        <p>resize cluster</p>
      </Dialog>
    );
  };

  renderAddNodesModal = () => {
    const { clusterStore, t } = this.props;
    const { hideAddNodesModal, isModalOpen, selectedNodeRole, onChangeNodeRole } = clusterStore;
    const roles = this.getClusterRoles();
    const hideRoles = roles.length === 1 && roles[0] === '';

    return (
      <Dialog
        title={t(`Add Nodes`)}
        isOpen={isModalOpen}
        onCancel={hideAddNodesModal}
        onSubmit={this.handleAddNodes}
      >
        <div className={styles.wrapAddNodes}>
          <div className={classnames(styles.formControl, { [styles.hide]: hideRoles })}>
            <label>{t('Node Role')}</label>
            <Radio.Group value={selectedNodeRole || roles[0]} onChange={onChangeNodeRole}>
              {roles.map((role, idx) => (
                <Radio value={role} key={idx} className={styles.radio}>
                  {role}
                </Radio>
              ))}
            </Radio.Group>
          </div>
          <div className={styles.formControl}>
            <label>{t('Node Count')}</label>
            <Input
              name="node_count"
              type="number"
              className={styles.input}
              defaultValue={1}
              required
            />
          </div>
        </div>
      </Dialog>
    );
  };

  renderDeleteNodesModal = () => {
    const { clusterStore, t } = this.props;
    const { hideDeleteNodesModal, isModalOpen, selectedNodeIds } = clusterStore;

    return (
      <Dialog
        title={t('Delete Nodes')}
        isOpen={isModalOpen}
        onCancel={hideDeleteNodesModal}
        onSubmit={this.handleDeleteNodes}
      >
        {t('DEL_RESOURCE_TIPS', { resource_ids: selectedNodeIds.join(', ') })}
      </Dialog>
    );
  };

  renderModals = () => {
    const { modalType, isModalOpen } = this.props.clusterStore;

    if (!isModalOpen) {
      return null;
    }

    if (modalType === 'jobs') {
      return this.renderJobsModal();
    }

    if (modalType === 'parameters') {
      return this.renderParametersModal();
    }

    if (['delete', 'start', 'stop'].includes(modalType)) {
      return this.renderOperationModal();
    }

    if (modalType === 'addNodes') {
      return this.renderAddNodesModal();
    }

    if (modalType === 'deleteNodes') {
      return this.renderDeleteNodesModal();
    }

    if (modalType === 'resize') {
      return this.renderResizeClusterModal();
    }
  };

  getClusterRoles() {
    const { cluster } = this.props.clusterStore;
    return _.uniq(_.get(cluster, 'cluster_role_set', []).map(cl => cl.role));
  }

  renderToolbar() {
    const { clusterStore, t } = this.props;
    const { searchNode, onSearchNode, onClearNode, onRefreshNode, selectedNodeIds } = clusterStore;

    if (selectedNodeIds.length) {
      return (
        <Toolbar noRefreshBtn noSearchBox>
          <Button type="delete" onClick={this.handleClickDeleteNodes} className="btn-handle">
            {t('Delete')}
          </Button>
        </Toolbar>
      );
    }

    return (
      <Toolbar
        placeholder={t('Search Node')}
        searchWord={searchNode}
        onSearch={onSearchNode}
        onClear={onClearNode}
        onRefresh={onRefreshNode}
      >
        <Button type="primary" className={styles.addNodesBtn} onClick={this.handleClickAddNodes}>
          <Icon name="add" size="mini" type="white" />
          <span className={styles.addNodeTxt}>{t('Add Nodes')}</span>
        </Button>
      </Toolbar>
    );
  }

  render() {
    const { clusterStore, appStore, runtimeStore, sessInfo, t } = this.props;

    const { isLoading, onChangeNodeStatus, selectNodeStatus } = clusterStore;

    const detail = clusterStore.cluster;
    const clusterJobs = clusterStore.clusterJobs.toJSON();
    const clusterNodes = clusterStore.clusterNodes.toJSON();
    const appName = _.get(appStore.appDetail, 'name', '');
    const runtimeName = _.get(runtimeStore.runtimeDetail, 'name', '');
    const provider = _.get(runtimeStore.runtimeDetail, 'provider', '');
    const { clusterJobsOpen } = clusterStore;

    const columns = [
      {
        title: t('Name'),
        key: 'name',
        width: '130px',
        render: item => <TdName name={item.name} description={item.node_id} noIcon />
      },
      {
        title: t('Role'),
        key: 'role',
        render: item => item.role || t('None')
      },
      {
        title: t('Status'),
        key: 'status',
        render: item => <Status type={item.status} transition={item.transition_status} />
      },
      {
        title: t('Configuration'),
        key: 'configuration',
        width: '130px',
        render: item => <Configuration configuration={item.cluster_role || {}} />
      },
      {
        title: t('Private IP'),
        key: 'private_ip',
        dataIndex: 'private_ip',
        width: '100px'
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
      current: 1, // todo
      noCancel: false
    };

    const role = getSessInfo('role', sessInfo);
    const isNormal = role === 'normal';

    return (
      <Layout
        className={classnames({ [styles.clusterDetail]: !isNormal })}
        backBtn={isNormal && <BackBtn label="purchased" link="/purchased" />}
        isloading={isLoading}
        listenToJob={this.listenToJob}
        title="Purchased"
      >
        {role === 'developer' && (
          <NavLink>
            <Link to="/dashboard/apps">{t('My Apps')}</Link> / {t('Test')} /&nbsp;
            <Link to="/dashboard/clusters">{t('Clusters')}</Link> / {detail.name}
          </NavLink>
        )}

        {role === 'admin' && (
          <NavLink>
            {t('Store')} / <Link to="/dashboard/clusters">{t('All Clusters')}</Link> / {detail.name}
          </NavLink>
        )}

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
              <Card hasTable>
                {this.renderToolbar()}
                <Table
                  columns={columns}
                  dataSource={clusterNodes}
                  isLoading={isLoading}
                  filterList={filterList}
                  pagination={pagination}
                  rowSelection={{
                    type: 'checkbox',
                    selectType: 'onSelect',
                    selectedRowKeys: clusterStore.selectedNodeKeys,
                    onChange: clusterStore.onChangeSelectNodes
                  }}
                />
              </Card>
              {this.renderModals()}
            </Panel>
          </Section>
        </Grid>
      </Layout>
    );
  }
}
