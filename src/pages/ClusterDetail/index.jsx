import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import {
  Icon,
  Input,
  Radio,
  Button,
  Select,
  Table,
  Modal,
  Timeline,
  Popover
} from 'components/Base';
import Status from 'components/Status';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  clusterStore: rootStore.clusterStore
}))
@observer
export default class ClusterDetail extends Component {
  static async onEnter({ clusterStore }, { clusterId }) {
    clusterStore.fetch(clusterId);
    clusterStore.fetchNodes();
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      selectedRowKeys: [],
      showHistoryModal: false,
      showViewNodeModal: false
    };

    this.clusterNodes = this.props.clusterStore.clusterNodes;
  }

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

  nodeTypeChange = () => {};

  nodeTimeChange = () => {};

  refreshTable = () => {
    this.setState({
      selectedRowKeys: []
    });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('changed: ', selectedRowKeys, selectedRows);
  };

  renderNodesTable = () => {
    const { selectedRowKeys } = this.state;
    const renderTableOperation = node => (
      <div id={node.id} className="operate-menu">
        <span
          onClick={() => {
            this.openViewNodeModal(node);
          }}
        >
          View Node
        </span>
        <span>Delete Node</span>
      </div>
    );

    const data = this.clusterNodes;
    const columns = [
      {
        title: 'Node ID',
        dataIndex: 'id',
        key: 'node_id',
        width: '13%',
        render: text => (
          <Link className="id-link" to="/">
            {text}
          </Link>
        )
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '13%'
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        width: '7%'
      },
      {
        title: 'Node Status',
        dataIndex: 'node_status',
        key: 'node_status',
        width: '13%',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Service Status',
        dataIndex: 'service_status',
        key: 'service_status',
        width: '14%',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Configuration',
        dataIndex: 'configuration',
        key: 'configuration',
        width: '16%'
      },
      {
        title: 'Date Created',
        dataIndex: 'created',
        key: 'created',
        width: '13%',
        render: getParseDate
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'operation',
        width: '6%',
        render: (text, node) => <Popover content={renderTableOperation(node)}>...</Popover>
      }
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    return <Table rowSelection={rowSelection} columns={columns} dataSource={data} />;
  };

  renderViewNodeModal = () => {
    const { showViewNodeModal, viewNode } = this.state;

    if (showViewNodeModal) {
      return (
        <Modal
          className={styles.viewNodeModal}
          width={1128}
          visible={showViewNodeModal}
          hideHeader
          hideFooter
          onCancel={this.closeViewNodeModal}
        >
          <div className={classNames(styles.detail, styles.nodeDetail)}>
            <div className={styles.detailBase}>
              <div className={styles.detailBaseInfo}>
                <strong>{viewNode.name}</strong>
                <p>
                  <span className="id">{viewNode.id}</span>
                  <Status type="active" name="Active" />
                </p>
              </div>
              <i className="icon icon-close" onClick={this.closeViewNodeModal} />
            </div>
            <ul className={styles.detailExpand}>
              <li>
                <div className={styles.detailExpandValue}>Node</div>
                <div className={styles.detailExpandName}>Role</div>
              </li>
              <li>
                <div className={styles.detailExpandValue}>Super high performance</div>
                <div className={styles.detailExpandName}>Type</div>
              </li>
              <li>
                <div className={styles.detailExpandValue}>2-Core 4GB 20GB</div>
                <div className={styles.detailExpandName}>Configuration</div>
              </li>
              <li>
                <div className={styles.detailExpandValue}>192.168.0.4</div>
                <div className={styles.detailExpandName}>Private IP</div>
              </li>
            </ul>
          </div>

          <div className={styles.statistics}>
            <Radio.Group
              className={styles.statisticsRadioGroup}
              value="2"
              onChange={this.nodeTypeChange}
            >
              <Radio.Button value="1">Service</Radio.Button>
              <Radio.Button value="2">Resource</Radio.Button>
            </Radio.Group>
            <Radio.Group
              className={styles.statisticsRadioGroup}
              value="3"
              onChange={this.nodeTimeChange}
            >
              <Radio.Button value="1">Last 6 Hours</Radio.Button>
              <Radio.Button value="2">Last Day</Radio.Button>
              <Radio.Button value="3">Last 2 Weeks</Radio.Button>
              <Radio.Button value="4">Last Months</Radio.Button>
              <Radio.Button value="5">Last 6 Months</Radio.Button>
            </Radio.Group>
          </div>
        </Modal>
      );
    }
    return null;
  };

  renderHistoryModal = () => (
    <Modal
      width={744}
      title="History"
      visible={this.state.showHistoryModal}
      hideFooter
      onCancel={this.closeHistoryModal}
    >
      <Timeline className={styles.historyLine}>
        <Timeline.Item dot={<Icon name="stop" />}>
          <div className={styles.historyItem}>
            <div className={styles.resource}>
              <strong>Stop Resources</strong>
              <p>2017/10/16 15:54:27</p>
            </div>
            <div className={styles.jobStatus}>
              <strong>Job Status</strong>
              <p>Successful</p>
            </div>
          </div>
        </Timeline.Item>
        <Timeline.Item dot={<Icon name="establish" />}>
          <div className={styles.historyItem}>
            <div className={styles.resource}>
              <strong>Create Resource</strong>
              <p>2017/09/13 14:48:47</p>
            </div>
            <div className={styles.jobStatus}>
              <strong>Job Status</strong>
              <p>Successful</p>
            </div>
            <div className={styles.vxnet}>
              <strong>VxNet</strong>
              <Link className="id-link" to="/">
                appcenter-vxnet
              </Link>
            </div>
          </div>
        </Timeline.Item>
      </Timeline>
    </Modal>
  );

  render() {
    return (
      <div className={styles.cluster}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <Link to="/dashboard/clusters">
              <i className="fa fa-long-arrow-left" /> Back to Clusters
            </Link>
          </div>

          <div className={styles.detail}>
            <div className={styles.detailBase}>
              <div className={styles.detailBaseInfo}>
                <strong>EsgynDB-Cluster1</strong>
                <p>
                  <span className="id">cl-eaazvhea</span>
                  <Status type="active" name="Active" />
                </p>
              </div>
              <div className={styles.detailBaseHandle}>
                <Button>
                  <Icon name="modify" />Modify Attributes
                </Button>
                <Button
                  onClick={() => {
                    this.openHistoryModal();
                  }}
                >
                  <Icon name="history" />View History
                </Button>
                <Select className={styles.handleSelect} value="More">
                  <Select.Option value="1">one</Select.Option>
                  <Select.Option value="2">two</Select.Option>
                </Select>
              </div>
            </div>
            <ul className={styles.detailExpand}>
              <li>
                <div className={styles.detailExpandValue}>EsgynDB</div>
                <div className={styles.detailExpandName}>App</div>
              </li>
              <li>
                <div className={styles.detailExpandValue}>1.1.2</div>
                <div className={styles.detailExpandName}>Version</div>
              </li>
              <li>
                <div className={styles.detailExpandValue}>3</div>
                <div className={styles.detailExpandName}>Node Count</div>
              </li>
              <li>
                <div className={styles.detailExpandValue}>vxnet-f1wa5ox</div>
                <div className={styles.detailExpandName}>Network</div>
              </li>
            </ul>
          </div>

          <div className={styles.nodes}>
            <div className={styles.nodesTitle}>Nodes</div>
            <div className={styles.nodesContent}>
              <div className={styles.toolbar}>
                <Button className={styles.refresh} onClick={this.refreshTable}>
                  <Icon name="refresh" />
                </Button>
                <Select className={styles.select} value="All Status">
                  <Select.Option value="1">Types1</Select.Option>
                  <Select.Option value="2">Types2</Select.Option>
                </Select>
                <Input.Search className={styles.search} placeholder="Search Node ID or App Name" />

                <div className={styles.nodesHandle}>
                  <Button>
                    <Icon name="create" />Create Node
                  </Button>
                  <Select className={styles.handleSelect} value="More">
                    <Select.Option value="1">one</Select.Option>
                    <Select.Option value="2">two</Select.Option>
                  </Select>
                </div>
              </div>

              {this.renderNodesTable()}
              {this.renderViewNodeModal()}
            </div>
          </div>
        </div>

        {this.renderHistoryModal()}
      </div>
    );
  }
}
