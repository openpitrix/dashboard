import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import _, { get } from 'lodash';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import { Icon, Popover } from 'components/Base';
import Layout, { BackBtn, Grid, Section, Card, Panel, NavLink } from 'components/Layout';
import TimeAxis from 'components/TimeAxis';
import ClusterCard from 'components/DetailCard/ClusterCard';

// import renderHandleMenu from '../action-buttons.jsx';

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
  rootStore,
}))
@observer
export default class ClusterDetail extends Component {
  constructor(props) {
    super(props);
    const { clusterStore } = props;
    clusterStore.page = 'detail';
    clusterStore.loadNodeInit();
  }

  async componentDidMount()  {
    const { clusterStore, clusterDetailStore, runtimeStore, appStore, match } = this.props;
    const clusterId = get(match, 'params.clusterId');
    clusterDetailStore.fetchPage({ clusterId, clusterStore, runtimeStore, appStore, userStore });

    // reset
    // clusterStore.loadNodeInit();

    await clusterStore.fetch(clusterId);
    await clusterStore.fetchJobs(clusterId);

    const { cluster } = clusterStore;

    if (cluster.app_id) {
      await appStore.fetch(cluster.app_id);
    }
    if (cluster.runtime_id) {
      await runtimeStore.fetch(cluster.runtime_id);
    }

    if (!runtimeStore.isKubernetes) {
      await clusterStore.fetchNodes({ cluster_id: clusterId });
    } else {
      clusterDetailStore.formatClusterNodes({
        clusterStore,
        type: 'Deployment'
      });
    }
  }

  listenToJob = async ({ op, rtype, rid, values = {} }) => {
    const { clusterStore, match } = this.props;
    const { clusterId } = match.params;
    const { jobs } = clusterStore;

    const status = _.pick(values, ['status', 'transition_status']);
    // const logJobs = () => clusterStore.info(`${op}: ${rid}, ${JSON.stringify(status)}`);

    if (op === 'create:job' && values.cluster_id === clusterId) {
      // new job
      jobs[rid] = clusterId;
      await clusterStore.fetchJobs(clusterId);
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
    }

    if (rtype === 'cluster' && rid === clusterId) {
      Object.assign(clusterStore.cluster, status);
    }

    if (rtype === 'cluster_node') {
      const curNodes = clusterStore.clusterNodes.toJSON().map(node => node.node_id);

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

  renderBreadcrumb(cluster){
    const {user, t}=this.props;
    const { isDev, isAdmin } = user;

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
    )
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

    const { runtimeDetail, isKubernetes } = runtimeStore;

    const { cluster, isLoading, clusterJobsOpen } = clusterStore;

    const clusterJobs = clusterStore.clusterJobs.toJSON();
    const appName = _.get(appStore.appDetail, 'name', '');
    const runtimeName = _.get(runtimeDetail, 'name', '');
    const provider = _.get(runtimeDetail, 'provider', '');
    const userName = _.get(userStore.userDetail, 'name', '');

    const { isNormal, isDev, isAdmin } = user;

    const tableProps = {
      runtimeStore,
      clusterStore,
      clusterDetailStore,
      t
    };
    const actionProps = {
      clusterStore,
      appVersionStore,
      t
    };
    let tags = null;
    if (!isKubernetes) {
      tags = ['Nodes'];
    } else {
      tags = ['Deployments', 'StatefulSets', 'DaemonSets'];
    }

    return (
      <Layout
        className={classnames({ [styles.clusterDetail]: !user.isNormal })}
        backBtn={user.isNormal && <BackBtn label="purchased" link="/purchased" />}
        isloading={isLoading}
        listenToJob={this.listenToJob}
        title="Purchased"
      >
        {this.renderBreadcrumb(cluster)}

        <Grid>
          <Section>
            <Card>
              <ClusterCard
                detail={cluster}
                appName={appName}
                runtimeName={runtimeName}
                provider={provider}
                userName={userName}
              />

              <Popover
                className="operation"
                content={this.renderHandleMenu({
                  item: cluster,
                  clusterStore,
                  runtimeStore,
                  page: 'detail',
                  t
                })}
              >
                <Icon name="more" />
              </Popover>
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
              {
                isKubernetes ? <Helm cluster={cluster} /> : <VMbase cluster={cluster} />
              }
            </Panel>
          </Section>

        </Grid>
      </Layout>
    );
  }
}
