import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';
import classnames from 'classnames';

import { Icon, Input, Button, Table, Pagination, Popover, Modal } from 'components/Base';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import TdName from 'components/TdName';
import TimeAxis from 'components/TimeAxis';
import ClusterCard from 'components/DetailCard/ClusterCard';
import Layout, { BackBtn, Dialog } from 'components/Layout/Admin';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore
}))
@observer
export default class ClusterDetail extends Component {
  static async onEnter({ clusterStore }, { clusterId }) {
    await clusterStore.fetch(clusterId);
    await clusterStore.fetchJobs(clusterId);
    await clusterStore.fetchNodes(clusterId);
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
    const { isModalOpen, hideModal } = this.props.clusterStore;
    const clusterJobs = toJS(this.props.clusterStore.clusterJobs);

    return (
      <Modal width={744} title="Activities" visible={isModalOpen} hideFooter onCancel={hideModal}>
        <TimeAxis timeList={clusterJobs} />
      </Modal>
    );
  };

  clusterParametersModal = () => {
    const { isModalOpen, hideModal } = this.props.clusterStore;

    return (
      <Dialog title="Parameters" onCancel={hideModal} noActions isOpen={isModalOpen} width={744}>
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

  showClusterJobs = e => {};

  render() {
    const { clusterStore } = this.props;
    const detail = toJS(clusterStore.cluster);
    const clusterJobs = toJS(clusterStore.clusterJobs);
    const clusterNodes = toJS(clusterStore.clusterNodes);

    const columns = [
      {
        title: 'Name',
        key: 'name',
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
        render: obj => <Status type={obj.status} name={obj.status} />
      },
      {
        title: 'Service',
        key: 'server_id',
        dataIndex: 'server_id'
      },
      {
        title: 'App Version',
        key: 'latest_version'
      },
      {
        title: 'Configuration',
        key: 'configuration'
      },
      {
        title: 'Private IP',
        key: 'private_ip'
      },
      {
        title: 'Updated At',
        key: 'status_time',
        render: obj => getParseDate(obj.status_time)
      }
    ];
    const tags = [{ id: 1, name: 'Nodes' }];
    const curTag = 'Nodes';

    return (
      <Layout>
        <BackBtn label="clusters" link="/dashboard/clusters" />
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.detailOuter}>
              <ClusterCard detail={detail} />
              <Popover className={styles.operation} content={this.renderHandleMenu()}>
                <Icon name="more" />
              </Popover>
            </div>
            <div className={styles.activities}>
              <div className={styles.title}>
                Activities
                <div className={styles.more} onClick={this.showClusterJobs}>
                  More →
                </div>
              </div>
              <TimeAxis timeList={clusterJobs.splice(0, 4)} />
            </div>
          </div>

          <div className={styles.rightInfo}>
            <div className={styles.wrapper2}>
              <TagNav tags={tags} curTag={curTag} />
              <div className={styles.toolbar}>
                <Input.Search className={styles.search} placeholder="Search Node Name" />
                <Button className={styles.buttonRight}>
                  <Icon name="refresh" />
                </Button>
              </div>
              <Table columns={columns} dataSource={clusterNodes} />
            </div>
            {clusterNodes.length > 0 && (
              <Pagination onChange={clusterStore.fetchNodes} total={clusterNodes.length} />
            )}
          </div>
        </div>
        {this.clusterJobsModal()}
        {this.clusterParametersModal()}
      </Layout>
    );
  }
}
