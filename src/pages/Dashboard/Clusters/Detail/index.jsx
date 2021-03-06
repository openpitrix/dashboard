import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import _, { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';

import { Icon, PopoverIcon, Select } from 'components/Base';
import Layout, {
  Grid, Section, Card, Panel, Dialog
} from 'components/Layout';
import Loading from 'components/Loading';
import TimeAxis from 'components/TimeAxis';
import ClusterCard from 'components/DetailCard/ClusterCard';

import Helm from './Helm';
import VMbase from './VMbase';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore,
  clusterDetailStore: rootStore.clusterDetailStore,
  appStore: rootStore.appStore,
  appVersionStore: rootStore.appVersionStore,
  runtimeStore: rootStore.runtimeStore,
  userStore: rootStore.userStore,
  sshKeyStore: rootStore.sshKeyStore,
  user: rootStore.user,
  rootStore
}))
@observer
export default class ClusterDetail extends Component {
  state = {
    isRuntimeTypeFetched: false
  };

  async componentDidMount() {
    const {
      rootStore,
      clusterStore,
      clusterDetailStore,
      runtimeStore,
      appStore,
      appVersionStore,
      sshKeyStore,
      userStore,
      user,
      match
    } = this.props;

    if (match.path.endsWith('/instances/:clusterId')) {
      clusterStore.onlyView = true;
    }

    const { clusterId } = match.params;

    await clusterDetailStore.fetch(clusterId);
    await clusterDetailStore.fetchJobs(clusterId);

    const { cluster } = clusterDetailStore;

    if (cluster.app_id) {
      await appStore.fetch(cluster.app_id);
      await appVersionStore.fetchAll({ app_id: cluster.app_id });
    }

    if (cluster.runtime_id) {
      await runtimeStore.fetch(cluster.runtime_id);
    }
    this.setState({ isRuntimeTypeFetched: true });

    await clusterDetailStore.fetchNodes({
      cluster_id: clusterId,
      isHelm: runtimeStore.isK8s
    });

    clusterDetailStore.isHelm = runtimeStore.isK8s;

    if (!runtimeStore.isK8s) {
      await sshKeyStore.fetchKeyPairs({ owner: user.user_id });
    }

    await userStore.fetchAll({ user_id: cluster.owner });

    rootStore.sock.listenToJob(this.handleJobs);
  }

  componentWillUnmount() {
    const { rootStore, clusterStore, clusterDetailStore } = this.props;
    rootStore.sock.unlisten(this.handleJobs);
    clusterStore.reset();
    clusterDetailStore.reset();
  }

  handleJobs = async ({ type = '', resource = {} }) => {
    const { rtype = '', rid = '', values = {} } = resource;
    const op = `${type}:${rtype}`;
    const { clusterStore, clusterDetailStore, match } = this.props;
    const { clusterId } = match.params;
    const { jobs } = clusterStore;
    const status = _.pick(values, ['status', 'transition_status']);

    if (op === 'create:job' && values.cluster_id === clusterId) {
      // new job
      jobs[rid] = clusterId;
      await clusterDetailStore.fetchJobs(clusterId);
    }

    // job updated, no need to check jobId
    // because when refresh page, last jobId in store will be clear
    if (op === 'update:job') {
      if (['successful', 'failed'].includes(status.status)) {
        // assume job is done
        await clusterDetailStore.fetch(clusterId);
        await clusterDetailStore.fetchJobs(clusterId);
        await clusterDetailStore.fetchNodes({ cluster_id: clusterId });
        delete jobs[rid];
      }
    }

    if (rtype === 'cluster' && rid === clusterId) {
      Object.assign(clusterDetailStore.cluster, status);
    }

    if (rtype === 'cluster_node') {
      const curNodes = clusterDetailStore.clusterNodes
        .toJSON()
        .map(node => node.node_id);

      if (curNodes.includes(rid)) {
        clusterDetailStore.clusterNodes = clusterDetailStore.clusterNodes.map(
          node => {
            if (node.node_id === rid) {
              Object.assign(node, status);
            }
            return node;
          }
        );
      }
    }
  };

  showClusterJobs = () => {
    this.props.clusterStore.showModal('jobs');
  };

  renderModals() {
    const {
      t, appVersionStore, clusterStore, clusterDetailStore
    } = this.props;
    const {
      modalType, isModalOpen, hideModal, doActions
    } = clusterStore;
    const handleTypes = ['cease', 'delete', 'start', 'stop', 'rollback'];

    if (!isModalOpen) {
      return null;
    }

    if (modalType === 'jobs') {
      const { clusterJobs } = clusterDetailStore;

      return (
        <Dialog
          title={t('Activities')}
          isOpen={isModalOpen}
          onCancel={hideModal}
          noActions
        >
          <TimeAxis
            className={styles.operateLogs}
            timeList={clusterJobs.toJSON()}
          />
        </Dialog>
      );
    }

    if (modalType === 'parameters') {
      return (
        <Dialog
          title="Parameters"
          isOpen={isModalOpen}
          onCancel={hideModal}
          noActions
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
          </ul>
        </Dialog>
      );
    }

    if (modalType === 'upgrade') {
      const { changeAppVersion } = clusterStore;
      const { versions } = appVersionStore;

      return (
        <Dialog
          title={t(`${capitalize(modalType)} cluster`)}
          isOpen={isModalOpen}
          onCancel={hideModal}
          onSubmit={doActions}
        >
          <Select value={clusterStore.versionId} onChange={changeAppVersion}>
            {versions.map(({ version_id, name }) => (
              <Select.Option key={version_id} value={version_id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Dialog>
      );
    }

    if (handleTypes.includes(modalType)) {
      return (
        <Dialog
          title={t(`${capitalize(modalType)} cluster`)}
          isOpen={isModalOpen}
          onCancel={hideModal}
          onSubmit={doActions}
        >
          {t('operate cluster desc', { operate: t(capitalize(modalType)) })}
        </Dialog>
      );
    }
  }

  renderHandleMenu = () => {
    const {
      clusterStore, clusterDetailStore, runtimeStore, t
    } = this.props;
    const { showOperateCluster } = clusterStore;
    const { cluster_id, status } = clusterDetailStore.cluster;

    const { isK8s } = runtimeStore;

    const renderBtn = (type, text, iconName) => (
      <span onClick={() => showOperateCluster(cluster_id, type)}>
        <Icon name={iconName} type="dark" size={16} />
        {text}
      </span>
    );

    const renderMenuBtns = () => {
      if (isK8s) {
        return (
          <Fragment>
            {status === 'deleted'
              && renderBtn('cease', t('Cease cluster'), 'stop')}
            {status !== 'deleted'
              && renderBtn('rollback', t('Rollback cluster'), 'restart')}
            {status !== 'deleted'
              && renderBtn('update_env', t('Update cluster env'), 'pen')}
            {status !== 'deleted'
              && renderBtn('upgrade', t('Upgrade cluster'), 'pull')}
          </Fragment>
        );
      }

      return (
        <Fragment>
          {status === 'stopped'
            && renderBtn('start', t('Start cluster'), 'start')}
          {status === 'active' && renderBtn('stop', t('Stop cluster'), 'stop')}
          {status === 'active'
            && renderBtn('resize', t('Resize cluster'), 'restart')}
          {status !== 'deleted'
            && renderBtn('update_env', t('Update cluster env'), 'pen')}
        </Fragment>
      );
    };

    return (
      <div className="operate-menu">
        {renderMenuBtns()}
        {status !== 'deleted' && (
          <span onClick={() => showOperateCluster(cluster_id, 'delete')}>
            <Icon name="trash" type="dark" size={16} />
            {t('Delete cluster')}
          </span>
        )}
      </div>
    );
  };

  renderMain() {
    const {
      clusterStore,
      appStore,
      appVersionStore,
      clusterDetailStore,
      runtimeStore,
      userStore,
      user,
      t
    } = this.props;

    const { cluster, clusterJobs } = clusterDetailStore;
    const { runtimeDetail, isK8s } = runtimeStore;
    const { isRuntimeTypeFetched } = this.state;
    const { onlyView } = clusterStore;
    const { versions } = appVersionStore;
    const version = _.find(versions, { version_id: cluster.version_id }) || {};

    return (
      <Fragment>
        <Grid>
          <Section>
            <Card>
              <ClusterCard
                isUserPortal={user.isUserPortal}
                detail={cluster}
                app={appStore.appDetail}
                version={version}
                runtimeName={_.get(runtimeDetail, 'name', '')}
                provider={_.get(runtimeDetail, 'provider', '')}
                users={userStore.users}
              />
              {cluster.status !== 'deleted' && !onlyView && (
                <PopoverIcon
                  className="operation"
                  content={this.renderHandleMenu()}
                />
              )}
            </Card>

            <Card className={styles.activities}>
              <div className={styles.title}>
                {t('Activities')}
                <div className={styles.more} onClick={this.showClusterJobs}>
                  {t('View all')} →
                </div>
              </div>
              <TimeAxis timeList={clusterJobs.toJSON().splice(0, 4)} />
            </Card>
          </Section>

          <Section size={8}>
            <Loading isLoading={!isRuntimeTypeFetched}>
              <Panel>
                {isK8s ? (
                  <Helm cluster={cluster} />
                ) : (
                  <VMbase cluster={cluster} />
                )}
              </Panel>
            </Loading>
          </Section>
        </Grid>

        {this.renderModals()}
      </Fragment>
    );
  }

  render() {
    const { user, clusterStore, t } = this.props;
    const { onlyView } = clusterStore;
    let pageTitle = onlyView
      ? t('Customer-Instance detail')
      : t('Sandbox-Instance detail');

    if (user.isAdmin) {
      pageTitle = t('Instance detail');
    }

    if (user.isUserPortal) {
      return this.renderMain();
    }

    return (
      <Layout
        className={classnames({
          [styles.clusterDetail]: !user.isNormal
        })}
        pageTitle={pageTitle}
        hasBack
      >
        {this.renderMain()}
      </Layout>
    );
  }
}
