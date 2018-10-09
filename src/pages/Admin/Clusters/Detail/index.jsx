import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import _, { get } from 'lodash';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import { Icon, Popover, Modal } from 'components/Base';
import Layout, { BackBtn, Dialog, Grid, Section, Card, Panel, NavLink } from 'components/Layout';
import TagNav from 'components/TagNav';
import TimeAxis from 'components/TimeAxis';
import Toolbar from 'components/Toolbar';
import ClusterCard from 'components/DetailCard/ClusterCard';
import ClusterNodesTable from './TableNodes';
import renderHandleMenu from '../action-buttons.jsx';
import ActionModal from '../action-modal';

import styles from './index.scss';

@translate()
@inject(({ rootStore, sock }) => ({
  clusterStore: rootStore.clusterStore,
  clusterDetailStore: rootStore.clusterDetailStore,
  appStore: rootStore.appStore,
  appVersionStore: rootStore.appVersionStore,
  runtimeStore: rootStore.runtimeStore,
  userStore: rootStore.userStore,
  user: rootStore.user,
  sock
}))
@observer
export default class ClusterDetail extends Component {
  constructor(props) {
    super(props);
    const { clusterStore } = props;
    clusterStore.page = 'detail';
    clusterStore.loadNodeInit();
  }

  async componentDidMount() {
    const {
      clusterStore,
      clusterDetailStore,
      runtimeStore,
      appStore,
      userStore,
      match
    } = this.props;
    const clusterId = get(match, 'params.clusterId');

    await clusterDetailStore.fetchPage({ clusterId, clusterStore, runtimeStore, appStore, userStore });
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

  clusterJobsModal = () => {
    const { t } = this.props;
    const { isModalOpen, hideModal, clusterJobs } = this.props.clusterStore;
    const jobs = clusterJobs.toJSON();

    return (
      <Dialog title={t('Activities')} isOpen={isModalOpen} onCancel={hideModal} noActions>
        <TimeAxis timeList={jobs} />
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

    const { modalType, clusterJobsOpen } = clusterStore;
    const {
      onSearchNode,
      onClearNode,
      onRefreshNode,
      searchNode,
      onChangeKubespacesTag,
      isLoading
    } = clusterDetailStore;
    const { runtimeDetail, isKubernetes } = runtimeStore;

    const detail = clusterStore.cluster;
    const clusterJobs = clusterStore.clusterJobs.toJSON();
    const appName = _.get(appStore.appDetail, 'name', '');
    const runtimeName = _.get(runtimeDetail, 'name', '');
    const provider = _.get(runtimeDetail, 'provider', '');
    const userName = _.get(userStore.userDetail, 'username', '');

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
        className={classnames({ [styles.clusterDetail]: !isNormal })}
        backBtn={isNormal && <BackBtn label="purchased" link="/purchased" />}
        isLoading={isLoading}
        listenToJob={this.listenToJob}
        title="Purchased"
      >
        {isDev && (
          <NavLink>
            <Link to="/dashboard/apps">{t('My Apps')}</Link> / {t('Test')} /&nbsp;
            <Link to="/dashboard/clusters">{t('Clusters')}</Link> / {detail.name}
          </NavLink>
        )}

        {isAdmin && (
          <NavLink>
            {t('Platform')} / <Link to="/dashboard/clusters">{t('All Clusters')}</Link> /{' '}
            {detail.name}
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
                userName={userName}
              />
              <Popover
                className="operation"
                content={renderHandleMenu({
                  item: detail,
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

          {!isLoading && (
            <Section size={8}>
              <Panel>
                <TagNav
                  tags={tags}
                  changeTag={onChangeKubespacesTag({
                    clusterStore,
                    isKubernetes
                  })}
                />
                <Card hasTable>
                  <Toolbar
                    placeholder={t('Search Node')}
                    searchWord={searchNode}
                    onSearch={onSearchNode(isKubernetes, clusterStore)}
                    onClear={onClearNode(isKubernetes, clusterStore)}
                    onRefresh={onRefreshNode(isKubernetes, clusterStore)}
                  />
                  <ClusterNodesTable {...tableProps} />
                </Card>
                {modalType === 'jobs' && this.clusterJobsModal()}
                {modalType === 'parameters' && this.clusterParametersModal()}
                <ActionModal {...actionProps} />
              </Panel>
            </Section>
          )}
        </Grid>
      </Layout>
    );
  }
}
