import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import _, { capitalize } from 'lodash';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import { Icon, Popover, Modal, Select, CodeMirror } from 'components/Base';
import Layout, { BackBtn, Grid, Section, Card, Panel, NavLink, Dialog } from 'components/Layout';
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
  user: rootStore.user,
  rootStore
}))
@observer
export default class ClusterDetail extends Component {
  async componentDidMount() {
    const {
      clusterDetailStore,
      clusterStore,
      runtimeStore,
      appStore,
      appVersionStore,
      match
    } = this.props;
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
    await clusterDetailStore.fetchNodes({
      cluster_id: clusterId,
      isHelm: runtimeStore.isK8s
    });

    // if (!runtimeStore.isK8s) {
    //   // vmbase
    // } else {
    //   clusterDetailStore.formatClusterNodes({
    //     clusterStore,
    //     type: 'Deployment'
    //   });
    // }
  }

  listenToJob = async ({ op, rtype, rid, values = {} }) => {
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
      const curNodes = clusterDetailStore.clusterNodes.toJSON().map(node => node.node_id);

      if (curNodes.includes(rid)) {
        clusterDetailStore.clusterNodes = clusterDetailStore.clusterNodes.map(node => {
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

  showClusterJobs = () => {
    this.props.clusterStore.showModal('jobs');
  };

  showClusterParameters = () => {
    this.props.clusterStore.showModal('parameters');
  };

  renderModals() {
    const { t, appVersionStore, clusterStore, clusterDetailStore } = this.props;
    const { modalType, isModalOpen, hideModal } = clusterStore;
    const handleTypes = ['cease', 'delete', 'start', 'stop', 'rollback'];

    if (!isModalOpen) {
      return null;
    }

    if (modalType === 'jobs') {
      const { clusterJobs } = clusterDetailStore;

      return (
        <Dialog title={t('Activities')} isOpen={isModalOpen} onCancel={hideModal} noActions>
          <TimeAxis timeList={clusterJobs.toJSON()} />
        </Dialog>
      );
    }

    if (modalType === 'parameters') {
      return (
        <Modal title="Parameters" visible={isModalOpen} onCancel={hideModal} hideFooter>
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
        </Modal>
      );
    }

    if (modalType === 'upgrade') {
      const { changeAppVersion } = clusterStore;
      const { versions } = appVersionStore;
      if (versions.length === 0) {
        return null;
      }

      return (
        <Modal
          title={t(`${capitalize(modalType)} cluster`)}
          visible={isModalOpen}
          onCancel={hideModal}
          onOk={this.handleCluster}
        >
          <div className="formContent">
            <Select value={clusterStore.versionId} onChange={changeAppVersion}>
              {versions.map(({ version_id, name }) => (
                <Select.Option key={version_id} value={version_id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Modal>
      );
    }

    if (modalType === 'update_env') {
      const { changeEnv, env } = clusterStore;

      return (
        <Modal
          title={t(`${capitalize(modalType)} cluster`)}
          visible={isModalOpen}
          onCancel={hideModal}
          onOk={this.handleCluster}
        >
          <div className="formContent">
            <div className="inputItem">
              <CodeMirror code={env} onChange={changeEnv} options={{ mode: 'yaml' }} />
            </div>
          </div>
        </Modal>
      );
    }

    if (handleTypes.includes(modalType)) {
      return (
        <Dialog
          title={t(`${capitalize(modalType)} cluster`)}
          visible={isModalOpen}
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
    const { clusterId, clusterIds, modalType, operateType } = clusterStore;
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
    const { clusterStore, clusterDetailStore, runtimeStore, t } = this.props;
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
            {status !== 'deleted' && renderBtn('rollback', t('Rollback cluster'))}
            {status !== 'deleted' && renderBtn('update_env', t('Update cluster env'))}
            {status !== 'deleted' && renderBtn('upgrade', t('Upgrade cluster'))}
          </Fragment>
        );
      }

      return (
        <Fragment>
          {status === 'stopped' && renderBtn('start', t('Start cluster'))}
          {status === 'active' && renderBtn('stop', t('Stop cluster'))}
        </Fragment>
      );
    };

    return (
      <div className="operate-menu">
        {renderMenuBtns()}
        {/*<span onClick={() => showOperateCluster(cluster_id, 'resize')}>{t('Resize cluster')}</span>*/}
        {status !== 'deleted' && (
          <span onClick={() => showOperateCluster(cluster_id, 'delete')}>
            {t('Delete cluster')}
          </span>
        )}
      </div>
    );
  };

  renderBreadcrumb() {
    const { clusterDetailStore, user, t } = this.props;
    const { isDev, isAdmin } = user;
    const { cluster } = clusterDetailStore;

    return (
      <Fragment>
        {isDev && (
          <NavLink>
            <Link to="/dashboard/apps">{t('My Apps')}</Link> / {t('Test')} /&nbsp;
            <Link to="/dashboard/clusters">{t('Clusters')}</Link> / {cluster.name}
          </NavLink>
        )}

        {isAdmin && (
          <NavLink>
            {t('Platform')} / <Link to="/dashboard/clusters">{t('All Clusters')}</Link> /{' '}
            {cluster.name}
          </NavLink>
        )}
      </Fragment>
    );
  }

  render() {
    const {
      appStore,
      appVersionStore,
      clusterStore,
      clusterDetailStore,
      runtimeStore,
      userStore,
      user,
      t
    } = this.props;

    const { cluster, clusterJobs } = clusterDetailStore;
    const { runtimeDetail, isK8s } = runtimeStore;

    // const { isNormal, isDev, isAdmin } = user;
    //
    // const tableProps = {
    //   runtimeStore,
    //   clusterStore,
    //   clusterDetailStore,
    //   t
    // };
    // const actionProps = {
    //   clusterStore,
    //   appVersionStore,
    //   t
    // };

    return (
      <Layout
        className={classnames({ [styles.clusterDetail]: !isNormal })}
        backBtn={isNormal && <BackBtn label="purchased" link="/purchased" />}
        isLoading={isLoading}
        listenToJob={this.listenToJob}
        title="Purchased"
      >
        {this.renderBreadcrumb()}

        <Grid>
          <Section>
            <Card>
              <ClusterCard
                detail={cluster}
                appName={_.get(appStore.appDetail, 'name', '')}
                runtimeName={_.get(runtimeDetail, 'name', '')}
                provider={_.get(runtimeDetail, 'provider', '')}
              />

              <Popover className="operation" content={this.renderHandleMenu()}>
                <Icon name="more" />
              </Popover>
            </Card>

            <Card className={styles.activities}>
              <div className={styles.title}>
                {t('Activities')}
                <div className={styles.more} onClick={this.showClusterJobs}>
                  {t('More')} →
                </div>
              </div>
              <TimeAxis timeList={clusterJobs.toJSON().splice(0, 4)} />
            </Card>
          </Section>

          <Section size={8}>
            <Panel>{isK8s ? <Helm cluster={cluster} /> : <VMbase cluster={cluster} />}</Panel>
          </Section>
        </Grid>

        {this.renderModals()}
      </Layout>
    );
  }
}
