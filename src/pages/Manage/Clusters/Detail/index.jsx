import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';
import classNames from 'classnames';

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
import Modal from 'components/Base/Modal';
import Layout, { BackBtn } from 'pages/Layout/Admin';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore
}))
@observer
export default class ClusterDetail extends Component {
  static async onEnter({ clusterStore }, { clusterId }) {
    await clusterStore.fetchClusterDetail(clusterId);
    await clusterStore.fetchClusterActivities(clusterId);
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedRowKeys: [],
      showHistoryModal: false,
      showViewNodeModal: false,
      activities: []
    };
  }
  componentDidMount() {
    this.setState({
      activities: toJS(this.props.clusterStore.clusterActivities)
    });
  }

  openHistoryModal = () => {
    this.setState({
      showHistoryModal: true
    });
  };
  closeHistoryModal = () => {
    this.setState({
      showHistoryModal: false
    });
  };

  openViewNodeModal = node => {
    this.setState({
      viewNode: node,
      showViewNodeModal: true
    });
  };

  closeViewNodeModal = () => {
    this.setState({
      showViewNodeModal: false
    });
  };

  renderHistoryModal = () => (
    <Modal
      width={744}
      title="Activities"
      visible={this.state.showHistoryModal}
      hideFooter
      onCancel={this.closeHistoryModal}
    >
      <TimeAxis timeList={this.state.activities} />
    </Modal>
  );

  renderViewNodeModal = () => (
    <Modal
      width={744}
      title="Parameters"
      visible={this.state.showViewNodeModal}
      hideFooter
      onCancel={this.closeViewNodeModal}
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
            <p className={styles.explain}>Range: 50－4096, The EsgynDB will restart if modified.</p>
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

  render() {
    const { clusterStore } = this.props;
    const detail = toJS(clusterStore.clusterDetail);
    const data = [];
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
        //render: (name, obj) => <TdName name={name} description={obj.description} />
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role'
      },
      {
        title: 'Node Status',
        dataIndex: 'node_status',
        key: 'status'
        //render: text => <Status type={text} name={text} />
      },
      {
        title: 'Service Status',
        dataIndex: 'service_status',
        key: 'service_status'
        //render: text => <Status type={text} name={text} />
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
        dataIndex: 'updated_time',
        key: 'updated_time'
        //render: getParseDate
      }
    ];
    const tags = [{ id: 1, name: 'Nodes' }];
    const curTag = 'Nodes';

    return (
      <Layout>
        <BackBtn label="clusters" link="/manage/clusters" />
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <ClusterCard detail={detail} />
            <div className={styles.activities}>
              <div className={styles.title}>
                Activities
                <div
                  className={styles.more}
                  onClick={() => {
                    this.openHistoryModal();
                  }}
                >
                  More →
                </div>
              </div>
              <TimeAxis timeList={this.state.activities.splice(0, 4)} />
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
              <Table columns={columns} dataSource={data} />
            </div>
            <Pagination />
          </div>
        </div>
        {this.renderHistoryModal()}
        {this.renderViewNodeModal()}
      </Layout>
    );
  }
}
