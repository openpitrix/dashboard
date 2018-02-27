import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { getParseDate } from 'utils';

import Icon from 'components/Base/Icon';
import Input from 'components/Base/Input';
import Button from 'components/Base/Button';
import Select from 'components/Base/Select';
import Status from 'components/Status';
import Table from 'components/Base/Table';
import Modal from 'components/Base/Modal';
import Timeline from 'components/Base/Timeline';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore,
}))
@observer
export default class ClusterDetail extends Component {
  static async onEnter({ clusterStore }, { clusterId }) {
    await clusterStore.fetchClusterNodes(clusterId);
  }

  state = {
    selectedRowKeys: [],
    loading: false,
  };

  refreshTable = () => {
    this.setState({
      selectedRowKeys: [],
    });
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('changed: ', selectedRowKeys, selectedRows);
  }

  renderHistoryModal = () => {
    return (
      <Modal
        title="History"
        visible
        hideFooter
      >
        <Timeline className={styles.history}>
          <Timeline.Item>123</Timeline.Item>
          <Timeline.Item>234</Timeline.Item>
          <Timeline.Item>356</Timeline.Item>
        </Timeline>
      </Modal>
    );
  }

  render() {
    const { clusterStore } = this.props;
    const { selectedRowKeys } = this.state;

    const data = toJS(clusterStore.clusterNodes.items) || [];
    const columns = [
      {
        title: 'Node ID', dataIndex: 'node_id', key: 'node_id', width: '13%', render: text => <Link className={classNames(styles.idLink, 'id')} to="/">{text}</Link>,
      },
      {
        title: 'Name', dataIndex: 'name', key: 'name', width: '13%',
      },
      {
        title: 'Role', dataIndex: 'role', key: 'role', width: '7%',
      },
      {
        title: 'Node Status', dataIndex: 'node_status', key: 'node_status', width: '13%', render: text => <Status status={text} name={text} />,
      },
      {
        title: 'Service Status', dataIndex: 'service_status', key: 'service_status', width: '14%', render: text => <Status status={text} name={text} />,
      },
      {
        title: 'Configuration', dataIndex: 'configuration', key: 'configuration', width: '16%',
      },
      {
        title: 'Date Created', dataIndex: 'created', key: 'created', width: '13%', render: getParseDate,
      },
      {
        title: 'Operation', dataIndex: 'operation', key: 'operation', width: '6%', render: () => '...',
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={styles.cluster}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <Link to="/manage/clusters"><i className="fa fa-long-arrow-left"/> Back to Clusters</Link>
          </div>

          <div className={styles.detail}>
            <div className={styles.base}>
              <div className={styles.baseInfo}>
                <div className={styles.name}>EsgynDB-Cluster1</div>
                <p>
                  <span className="id">cl-eaazvhea</span>
                  <Status status="active" name="Active" />
                </p>
              </div>
              <div className={styles.baseHandle}>
                <Button><Icon name="modify" />Modify Attributes</Button>
                <Button><Icon name="history" />View History</Button>
                <Select className={styles.handleSelect} value="More">
                  <Select.Option value="1">one</Select.Option>
                  <Select.Option value="2">two</Select.Option>
                </Select>
              </div>
            </div>
            <ul className={styles.expand}>
              <li>
                <div className={styles.expandValue}>EsgynDB</div>
                <div className={styles.expandName}>App</div>
              </li>
              <li>
                <div className={styles.expandValue}>1.1.2</div>
                <div className={styles.expandName}>Version</div>
              </li>
              <li>
                <div className={styles.expandValue}>3</div>
                <div className={styles.expandName}>Node Count</div>
              </li>
              <li>
                <div className={styles.expandValue}>vxnet-f1wa5ox</div>
                <div className={styles.expandName}>Network</div>
              </li>
            </ul>
          </div>

          <div className={styles.nodes}>
            <div className={styles.nodesTitle}>Nodes</div>
            <div className={styles.nodesContent}>
              <div className={styles.toolbar}>
                <Button className={styles.refresh} onClick={this.refreshTable}><Icon name="refresh" /></Button>
                <Select className={styles.select} value="All Status">
                  <Select.Option value="1">Types1</Select.Option>
                  <Select.Option value="2">Types2</Select.Option>
                </Select>
                <Input.Search className={styles.search} placeholder="Search Node ID or App Name"/>

                <div className={styles.nodesHandle}>
                  <Button><Icon name="create" />Create Node</Button>
                  <Select className={styles.handleSelect} value="More">
                    <Select.Option value="1">one</Select.Option>
                    <Select.Option value="2">two</Select.Option>
                  </Select>
                </div>
              </div>

              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
              />
            </div>
          </div>

          {this.renderHistoryModal()}
        </div>
      </div>
    );
  }
}
