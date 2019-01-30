import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import _, { capitalize } from 'lodash';
import { translate } from 'react-i18next';

import { Icon, Popover, Select } from 'components/Base';
import CodeMirror from 'components/CodeMirror';
import Layout, {
  Grid, Section, Card, Panel, Dialog
} from 'components/Layout';
import Loading from 'components/Loading';
import TimeAxis from 'components/TimeAxis';
import ClusterCard from 'components/DetailCard/ClusterCard';

import Helm from './Helm';
import VMbase from './VMbase';

import styles from './index.scss';

@translate()
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
      user,
      match
    } = this.props;

    if (match.path.endsWith('instances/:clusterId')) {
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

    rootStore.listenToJob(this.handleJobs);
  }

  componentWillUnmount() {
    const { rootStore, clusterStore, clusterDetailStore } = this.props;
    rootStore.cleanSock();
    clusterStore.reset();
    clusterDetailStore.reset();
  }

  handleJobs = async ({
    op, rtype, rid, values = {}
  }) => {
    const { clusterStore, clusterDetailStore, match } = this.props;
    const { clusterId } = match.params;
    const { jobs } = clusterStore;

    const status = _.pick(values, ['status', 'transition_status']);
    // const logJobs = () => clusterStore.info(`${op}: ${rid}, ${JSON.stringify(status)}`);

    if (op === 'create:job' && values.cluster_id === clusterId) {
      // new job
      jobs[rid] = clusterId;
      await clusterDetailStore.fetchJobs(clusterId);
    }

    // job updated
    if (op === 'update:job' && jobs[rid] === clusterId) {
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
    const { modalType, isModalOpen, hideModal } = clusterStore;
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
          <TimeAxis timeList={clusterJobs.toJSON()} />
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
          onSubmit={this.handleCluster}
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

    if (modalType === 'update_env') {
      const { changeEnv, env, cancelChangeEnv } = clusterDetailStore;

      return (
        <Dialog
          width={744}
          title={t(`${capitalize(modalType)} cluster`)}
          isOpen={isModalOpen}
          onCancel={cancelChangeEnv}
          onSubmit={this.handleCluster}
        >
          <CodeMirror code={env} onChange={changeEnv} mode="yaml" />
        </Dialog>
      );
    }

    if (handleTypes.includes(modalType)) {
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
    }
  }

  handleCluster = () => {
    const { clusterStore } = this.props;
    const {
      clusterId, clusterIds, modalType, operateType
    } = clusterStore;
    const ids = operateType === 'multiple' ? clusterIds.toJSON() : [clusterId];

    switch (modalType) {
      case 'cease':
        clusterStore.cease(ids);
        break;
      case 'delete':
        clusterStore.remove(ids);
        break;
      case 'start':
        clusterStore.start(ids);
        break;
      case 'stop':
        clusterStore.stop(ids);
        break;
      case 'rollback':
        clusterStore.rollback(ids);
        break;
      case 'update_env':
        clusterStore.updateEnv(ids);
        break;
      case 'upgrade':
        clusterStore.upgradeVersion(ids);
        break;
      default:
        break;
    }
  };

  renderHandleMenu = () => {
    const {
      clusterStore, clusterDetailStore, runtimeStore, t
    } = this.props;
    const { showOperateCluster } = clusterStore;
    const { cluster_id, status } = clusterDetailStore.cluster;

    const { isK8s } = runtimeStore;

    const renderBtn = (type, text) => (
      <span onClick={() => showOperateCluster(cluster_id, type)}>{text}</span>
    );

    const renderMenuBtns = () => {
      if (isK8s) {
        return (
          <Fragment>
            {status === 'deleted' && renderBtn('cease', t('Cease cluster'))}
            {status !== 'deleted'
              && renderBtn('rollback', t('Rollback cluster'))}
            {status !== 'deleted'
              && renderBtn('update_env', t('Update cluster env'))}
            {status !== 'deleted' && renderBtn('upgrade', t('Upgrade cluster'))}
          </Fragment>
        );
      }

      return (
        <Fragment>
          {status === 'stopped' && renderBtn('start', t('Start cluster'))}
          {status === 'active' && renderBtn('stop', t('Stop cluster'))}
          {status === 'active' && renderBtn('resize', t('Resize cluster'))}
          {status !== 'deleted'
            && renderBtn('update_env', t('Update cluster env'))}
        </Fragment>
      );
    };

    return (
      <div className="operate-menu">
        {renderMenuBtns()}
        {status !== 'deleted' && (
          <span onClick={() => showOperateCluster(cluster_id, 'delete')}>
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
      clusterDetailStore,
      runtimeStore,
      userStore,
      t
    } = this.props;

    const { cluster, clusterJobs } = clusterDetailStore;
    const { runtimeDetail, isK8s } = runtimeStore;
    const { isRuntimeTypeFetched } = this.state;
    const { onlyView } = clusterStore;

    return (
      <Fragment>
        <Grid>
          <Section>
            <Card>
              <ClusterCard
                detail={cluster}
                appName={_.get(appStore.appDetail, 'name', '')}
                runtimeName={_.get(runtimeDetail, 'name', '')}
                provider={_.get(runtimeDetail, 'provider', '')}
                userName={_.get(userStore.userDetail, 'username', '')}
              />
              {cluster.status !== 'deleted'
                && !onlyView && (
                  <Popover
                    className="operation"
                    content={this.renderHandleMenu()}
                  >
                    <Icon name="more" />
                  </Popover>
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
    const { user, match, t } = this.props;
    const pageTitle = match.path.endsWith('sandbox-instance')
      ? t('Sandbox-Instance detail')
      : t('Customer-Instance detail');

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
