import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import ClusterCard from 'components/DetailCard/ClusterCard';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import TdName from 'components/TdName';
import TimeAxis from 'components/TimeAxis';
import Popover from 'components/Base/Popover';
import Modal from 'components/Base/Modal';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore,
  clusterHandleStore: rootStore.clusterHandleStore
}))
@observer
export default class ClusterDetail extends Component {
  static async onEnter({ clusterStore }, { clusterId }) {
    await clusterStore.fetchClusterDetail(clusterId);
    await clusterStore.fetchClusterJobs(clusterId);
    await clusterStore.fetchClusterNodes(clusterId);
  }

  renderHandleMenu = () => {
    const { clusterParametersOpen } = this.props.clusterHandleStore;
    return (
      <div className="operate-menu">
        <span onClick={clusterParametersOpen}>View Parameters</span>
      </div>
    );
  };

  clusterJobsModal = () => {
    const { showClusterJobs, clusterJobsClose } = this.props.clusterHandleStore;
    const clusterJobs = toJS(this.props.clusterStore.clusterJobs);
    return (
      <Modal
        width={744}
        title="Activities"
        visible={showClusterJobs}
        hideFooter
        onCancel={clusterJobsClose}
      >
        <TimeAxis timeList={clusterJobs} />
      </Modal>
    );
  };

  clusterParametersModal = () => {
    const { showClusterParameters, clusterParametersClose } = this.props.clusterHandleStore;
    return (
      <Modal
        width={744}
        title="Parameters"
        visible={showClusterParameters}
        hideFooter
        onCancel={clusterParametersClose}
      >
        <ul className={styles.modelContent}>
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
    const { clusterStore } = this.props;
    const detail = toJS(clusterStore.clusterDetail);
    const clusterJobs = toJS(clusterStore.clusterJobs);
    const clusterNodes = toJS(clusterStore.clusterNodes);
    const { clusterJobsOpen } = this.props.clusterHandleStore;
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, item) => <TdName name={name} description={item.description} />
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role'
      },
      {
        title: 'Node Status',
        dataIndex: 'node_status',
        key: 'status',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Service',
        dataIndex: 'server_id',
        key: 'server_id'
      },
      {
        title: 'App Version',
        dataIndex: 'latest_version',
        key: 'latest_version'
      },
      {
        title: 'Configuration',
        dataIndex: 'configuration',
        key: 'configuration'
      },
      {
        title: 'Private IP',
        dataIndex: 'private_ip',
        key: 'private_ip'
      },
      {
        title: 'Updated At',
        dataIndex: 'status_time',
        key: 'status_time',
        render: getParseDate
      }
    ];
    const tags = [{ id: 1, name: 'Nodes' }];
    const curTag = 'Nodes';

    return (
      <div className={styles.clusterDetail}>
        <ManageTabs />
        <div className={styles.backTo}>
          <Link to="/manage/clusters">← Back to Clusters</Link>
        </div>
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
                <div className={styles.more} onClick={clusterJobsOpen}>
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
              <Pagination onChange={clusterStore.fetchClusterNodes} total={clusterNodes.length} />
            )}
            <Pagination />
          </div>
        </div>
        {this.clusterJobsModal()}
        {this.clusterParametersModal()}
      </div>
    );
  }
}
