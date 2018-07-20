import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import { Icon, Button, Popover, Table } from 'components/Base';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import Statistics from 'components/Statistics';
import Layout, { Dialog, Grid, Row, Section, Card } from 'components/Layout';
import { formatTime } from 'utils';

import styles from './index.scss';

@inject(({ rootStore, sock }) => ({
  runtimeStore: rootStore.runtimeStore,
  clusterStore: rootStore.clusterStore,
  rootStore,
  sock
}))
@observer
export default class Runtimes extends Component {
  static async onEnter({ runtimeStore, clusterStore }) {
    runtimeStore.loadPageInit();
    await runtimeStore.fetchAll();
    await runtimeStore.runtimeStatistics();
    await clusterStore.fetchAll({
      status: ['active', 'stopped', 'ceased', 'pending', 'suspended', 'deleted']
    });
  }

  constructor(props) {
    super(props);

    if (props.sock && !props.sock._events['ops-resource']) {
      props.sock.on('ops-resource', this.listenToJob);
    }
  }

  listenToJob = payload => {
    const { rootStore } = this.props;

    if (['runtime', 'job'].includes(get(payload, 'resource.rtype'))) {
      rootStore.sockMessage = JSON.stringify(payload);
    }
  };

  renderHandleMenu = id => {
    const { runtimeStore } = this.props;
    const { showDeleteRuntime } = runtimeStore;

    return (
      <div id={id} className="operate-menu">
        <Link to={`/dashboard/runtime/${id}`}>View runtime detail</Link>
        <Link to={`/dashboard/runtime/edit/${id}`}>Modify runtime</Link>
        <span onClick={() => showDeleteRuntime(id)}>Delete runtime</span>
      </div>
    );
  };

  renderDeleteModal = () => {
    const { runtimeStore } = this.props;
    const { isModalOpen, hideModal, remove } = runtimeStore;

    return (
      <Dialog title="Delete Runtime" isOpen={isModalOpen} onSubmit={remove} onCancel={hideModal}>
        Are you sure delete this Runtime?
      </Dialog>
    );
  };

  renderToolbar() {
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      showDeleteRuntime,
      runtimeIds
    } = this.props.runtimeStore;

    if (runtimeIds.length) {
      return (
        <Toolbar>
          <Button type="delete" onClick={() => showDeleteRuntime(runtimeIds)}>
            Delete
          </Button>
        </Toolbar>
      );
    }

    return (
      <Toolbar
        placeholder="Search Runtimes Name"
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
        withCreateBtn={{ linkTo: `/dashboard/runtime/create` }}
      />
    );
  }

  render() {
    const { runtimeStore, clusterStore } = this.props;
    const data = runtimeStore.runtimes.toJSON();
    const clusters = clusterStore.clusters.toJSON();

    const {
      summaryInfo,
      isLoading,
      notifyMsg,
      hideMsg,
      currentPage,
      totalCount,
      changePagination,
      selectedRowKeys,
      onChangeSelect,
      onChangeStatus,
      selectStatus
    } = runtimeStore;

    const columns = [
      {
        title: 'Runtime Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, obj) => (
          <TdName
            name={name}
            description={obj.runtime_id}
            linkUrl={`/dashboard/runtime/${obj.runtime_id}`}
          />
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Provider',
        key: 'provider',
        render: item => <ProviderName name={item.provider} provider={item.provider} />
      },
      {
        title: ' Zone/Namespace',
        dataIndex: 'zone',
        key: 'zone'
      },
      {
        title: 'Cluster Count',
        key: 'node_count',
        render: runtime =>
          clusters.filter(cluster => runtime.runtime_id === cluster.runtime_id).length
      },
      {
        title: 'User',
        dataIndex: 'owner',
        key: 'owner'
      },
      {
        title: 'Updated At',
        key: 'status_time',
        render: runtime => formatTime(runtime.status_time, 'YYYY/MM/DD HH:mm:ss')
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: '80px',
        render: (text, item) => (
          <div className={styles.handlePop}>
            <Popover content={this.renderHandleMenu(item.runtime_id)}>
              <Icon name="more" />
            </Popover>
          </div>
        )
      }
    ];

    const rowSelection = {
      type: 'checkbox',
      selectType: 'onSelect',
      selectedRowKeys: selectedRowKeys,
      onChange: onChangeSelect
    };

    const filterList = [
      {
        key: 'status',
        conditions: [{ name: 'Active', value: 'active' }, { name: 'Deleted', value: 'deleted' }],
        onChangeFilter: onChangeStatus,
        selectValue: selectStatus
      }
    ];

    const pagination = {
      tableType: 'Runtimes',
      onChange: changePagination,
      total: totalCount,
      current: currentPage
    };

    return (
      <Layout msg={notifyMsg} hideMsg={hideMsg}>
        <Row>
          <Statistics {...summaryInfo} />
        </Row>

        <Row>
          <Grid>
            <Section size={12}>
              <Card>
                {this.renderToolbar()}
                <Table
                  columns={columns}
                  dataSource={data}
                  rowSelection={rowSelection}
                  isLoading={isLoading}
                  filterList={filterList}
                  pagination={pagination}
                />
              </Card>
              {this.renderDeleteModal()}
            </Section>
          </Grid>
        </Row>
      </Layout>
    );
  }
}
