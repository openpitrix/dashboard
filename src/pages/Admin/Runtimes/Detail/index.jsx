import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';

import RuntimeCard from 'components/DetailCard/RuntimeCard';
import Button from 'components/Base/Button';
import Icon from 'components/Base/Icon';
import Input from 'components/Base/Input';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import Popover from 'components/Base/Popover';
import TdName from 'components/TdName';
import Layout, { BackBtn } from 'pages/Layout/Admin';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  clusterStore: rootStore.clusterStore
}))
@observer
export default class RuntimeDetail extends Component {
  static async onEnter({ runtimeStore, clusterStore }, { runtimeId }) {
    await runtimeStore.fetchRuntimeDetail(runtimeId);
    await clusterStore.fetchQueryClusters({ runtime_id: runtimeId });
  }

  onSearch = async name => {
    const detail = this.props.runtimeStore.runtimeDetail;
    await this.props.clusterStore.fetchQueryClusters({
      runtime_id: detail.runtime_id,
      search_word: name
    });
  };

  onRefresh = async () => {
    const { runtimeStore } = this.props;
    await runtimeStore.fetchQueryClusters({ runtime_id: runtimeStore.runtimeDetail.runtime_id });
  };

  changeClusters = async current => {
    const { runtimeStore } = this.props;
    await runtimeStore.fetchQueryClusters({
      runtime_id: runtimeStore.runtimeDetail.runtime_id,
      offset: (current - 1) * runtimeStore.pageSize
    });
  };

  renderHandleMenu = id => {
    return (
      <div className="operate-menu">
        <Link to={`/dashboard/runtime/edit/${id}`}>Modify runtime</Link>
      </div>
    );
  };

  render() {
    const { runtimeStore, clusterStore } = this.props;
    const runtimeDetail = toJS(runtimeStore.runtimeDetail);
    const data = toJS(clusterStore.clusters);

    const columns = [
      {
        title: 'Cluster Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, obj) => <TdName name={name} description={obj.description} />
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'App Version',
        dataIndex: 'latest_version',
        key: 'latest_version'
      },
      {
        title: 'Node Count',
        dataIndex: 'node_count',
        key: 'id'
      },
      {
        title: 'Runtime',
        dataIndex: 'runtime',
        key: 'runtime'
      },
      {
        title: 'User',
        dataIndex: 'user',
        key: 'user'
      },
      {
        title: 'Date Created',
        dataIndex: 'create_time',
        key: 'create_time',
        render: getParseDate
      }
    ];
    const tags = [{ id: 1, name: 'Clusters' }];
    const curTag = 'Clusters';

    return (
      <Layout>
        <BackBtn label="runtimes" link="/dashboard/runtimes" />
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.detailOuter}>
              <RuntimeCard detail={runtimeDetail} />
              <Popover
                className={styles.operation}
                content={this.renderHandleMenu(runtimeDetail.runtime_id)}
              >
                <Icon name="more" />
              </Popover>
            </div>
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.wrapper2}>
              <TagNav tags={tags} curTag={curTag} />
              <div className={styles.toolbar}>
                <Input.Search
                  className={styles.search}
                  placeholder="Search Clusters Name"
                  onSearch={this.onSearch}
                />
                <Button className={styles.buttonRight} onClick={this.onRefresh}>
                  <Icon name="refresh" />
                </Button>
              </div>
              <Table columns={columns} dataSource={data} />
            </div>
            <ul />
            {clusterStore.totalCount > 0 && (
              <Pagination onChange={this.changeClusters} total={clusterStore.totalCount} />
            )}
          </div>
        </div>
      </Layout>
    );
  }
}
