import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { Icon, Button, Input, Table, Pagination, Popover } from 'components/Base';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import TdName from 'components/TdName';
import TagShow from 'components/TagShow';
import RuntimeCard from 'components/DetailCard/RuntimeCard';
import Layout, { BackBtn } from 'components/Layout/Admin';
import TimeShow from 'components/TimeShow';
import { getObjName } from 'utils';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  repoStore: rootStore.repoStore,
  appStore: rootStore.appStore,
  clusterStore: rootStore.appStore,
  runtimeStore: rootStore.runtimeStore
}))
@observer
export default class RepoDetail extends Component {
  static async onEnter({ repoStore, appStore, runtimeStore, clusterStore }, { repoId }) {
    await repoStore.fetchRepoDetail(repoId);
    await repoStore.fetchRepoEvents(repoId);
    await appStore.fetchAll({
      repo_id: repoId,
      status: ['active', 'deleted']
    });
    await runtimeStore.fetchAll({
      repo_id: repoId,
      status: ['active', 'deleted']
    });
    await clusterStore.fetchAll({
      status: ['active', 'stopped', 'ceased', 'pending', 'suspended', 'deleted']
    });
    repoStore.curTagName = 'Apps';
  }

  changeSelectors = items => {
    return (
      items &&
      items.map(item => ({
        label_key: item.selector_key,
        label_value: item.selector_value
      }))
    );
  };

  renderHandleMenu = id => {
    return (
      <div className="operate-menu">
        <Link to={`/dashboard/repo/edit/${id}`}>Modify repo</Link>
      </div>
    );
  };

  render() {
    const { repoStore, appStore, runtimeStore, clusterStore } = this.props;
    const repoDetail = toJS(repoStore.repoDetail);
    const appsData = toJS(appStore.apps);
    const appCount = appStore.totalCount;
    const runtimesData = toJS(runtimeStore.runtimes);
    const clusters = toJS(clusterStore.clusters) || [];
    const eventsData = toJS(repoStore.repoEvents);

    const appsColumns = [
      {
        title: 'App Name',
        key: 'name',
        width: '205px',
        render: item => (
          <TdName
            name={item.name}
            description={item.app_id}
            image={item.icon}
            linkUrl={`/dashboard/app/${item.app_id}`}
          />
        )
      },
      {
        title: 'Latest Version',
        key: 'latest_version',
        render: item => get(item, 'latest_app_version.name', '')
      },
      {
        title: 'Status',
        key: 'status',
        width: '120px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: 'Categories',
        key: 'category',
        render: item =>
          get(item, 'category_set', [])
            .filter(cate => cate.category_id)
            .map(cate => cate.name)
            .join(', ')
      },
      {
        title: 'Developer',
        key: 'owner',
        render: item => item.owner
      },
      {
        title: 'Updated At',
        key: 'status_time',
        render: item => <TimeShow time={item.status_time} />
      }
    ];
    const runtimesColumns = [
      {
        title: 'Runtime Name',
        key: 'name',
        width: '170px',
        render: item => (
          <TdName
            name={item.name}
            description={item.runtime_id}
            linkUrl={`/dashboard/runtime/${item.runtime_id}`}
          />
        )
      },
      {
        title: 'Status',
        key: 'status',
        width: '120px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: 'Provider',
        key: 'provider',
        render: item => item.provider
      },
      {
        title: 'Zone',
        key: 'zone',
        render: item => item.zone
      },
      {
        title: 'Cluster Count',
        key: 'node_count',
        render: item => clusters.filter(cluster => item.runtime_id === cluster.runtime_id).length
      },
      {
        title: 'User',
        key: 'owner',
        render: item => item.owner
      },
      {
        title: 'Updated At',
        key: 'status_time',
        width: '120px',
        render: item => <TimeShow time={item.status_time} />
      }
    ];
    const eventsColumns = [
      {
        title: 'Event Id',
        key: 'repo_event_id',
        width: '170px',
        render: item => item.repo_event_id
      },
      {
        title: 'Status',
        key: 'status',
        width: '120px',
        render: item => item.status
      },
      {
        title: 'User',
        key: 'owner',
        render: item => item.owner
      },
      {
        title: 'Updated At',
        key: 'status_time',
        width: '120px',
        render: item => <TimeShow time={item.status_time} />
      }
    ];

    const { tags, curTagName, selectCurTag } = repoStore;

    let data = [];
    let columns = [];
    let searchTip = 'Search App Name';
    let totalCount = 0;
    let changeTable;
    let selectors = [];

    switch (curTagName) {
      case 'Apps':
        data = appsData;
        columns = appsColumns;
        totalCount = appStore.totalCount;
        changeTable = async current => {
          await appStore.fetchAll({
            repo_id: repoDetail.repo_id,
            offset: (current - 1) * appStore.pageSize
          });
        };
        break;
      case 'Runtimes':
        data = runtimesData;
        columns = runtimesColumns;
        searchTip = 'Search Runtime Name';
        selectors = this.changeSelectors(repoDetail.selectors);
        totalCount = runtimeStore.totalCount;
        changeTable = async current => {
          await runtimeStore.fetchAll({
            repo_id: repoDetail.repo_id,
            offset: (current - 1) * runtimeStore.pageSize
          });
        };
        break;
      case 'Events':
        data = eventsData;
        columns = eventsColumns;
        totalCount = eventsData.length;
        searchTip = 'Search Events';
        break;
    }

    return (
      <Layout>
        <BackBtn label="repos" link="/dashboard/repos" />
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.detailOuter}>
              <RuntimeCard detail={repoDetail} appCount={appCount} />
              {repoDetail.status !== 'deleted' && (
                <Popover
                  className={styles.operation}
                  content={this.renderHandleMenu(repoDetail.repo_id)}
                >
                  <Icon name="more" />
                </Popover>
              )}
            </div>
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.wrapper2}>
              <TagNav
                tags={toJS(tags)}
                curTag={curTagName}
                changeTag={selectCurTag.bind(repoStore)}
              />
              {curTagName === 'Runtimes' && (
                <div className={styles.selector}>
                  <div className={styles.title}>Runtime Selectors</div>
                  <TagShow tags={selectors} tagStyle="yellow" />
                </div>
              )}

              <div className={styles.toolbar}>
                <Input.Search className={styles.search} placeholder={searchTip} />
                <Button className={styles.buttonRight}>
                  <Icon name="refresh" />
                </Button>
              </div>

              <Table columns={columns} dataSource={data} className="detailTab" />
            </div>
            <Pagination onChange={changeTable} total={totalCount} />
          </div>
        </div>
      </Layout>
    );
  }
}
