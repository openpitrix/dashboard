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
import Modal from 'components/Base/Modal';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore
}))
@observer
export default class ClusterDetail extends Component {
  static async onEnter({ clusterStore }, { clusterId }) {
    await clusterStore.fetchClusterDetail(clusterId);
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedRowKeys: [],
      showHistoryModal: false,
      showViewNodeModal: false
    };
    this.clusterNodes = toJS(this.props.clusterStore.clusterNodes.items) || [];

    this.ativities = [
      { name: 'Stop Cluster', time: '2017/10/16 15:54:27' },
      { name: 'Create Cluster', time: '2017/09/13 14:48:47' },
      { name: 'Create Cluster', time: '2017/09/13 14:48:47' },
      { name: 'Stop Resources', time: '2017/09/13 14:48:47' }
    ];
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
      <TimeAxis timeList={this.ativities} />
    </Modal>
  );

  renderViewNodeModal = () => (
    <Modal
      width={744}
      title="Parameters"
      visible={this.state.showViewNodeModal}
      hideFooter
      onCancel={this.renderViewNodeModal}
    >
      <div>development...</div>
    </Modal>
  );

  render() {
    const { clusterStore } = this.props;
    const detail = toJS(clusterStore.clusterDetail) || {};
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
      <div className={styles.clusterDetail}>
        <ManageTabs />
        <div className={styles.backTo}>
          <Link to="/manage/clusters">← Back to Clusters</Link>
        </div>
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
              <TimeAxis timeList={this.ativities} />
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
      </div>
    );
  }
}
