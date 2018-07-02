import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';

import { Icon, Button, Input, Table, Pagination, Popover } from 'components/Base';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import TdName from 'components/TdName';
import TagShow from 'components/TagShow';
import RuntimeCard from 'components/DetailCard/RuntimeCard';
import Layout, { BackBtn } from 'components/Layout/Admin';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  repoStore: rootStore.repoStore,
  appStore: rootStore.appStore,
  runtimeStore: rootStore.runtimeStore
}))
@observer
export default class RepoDetail extends Component {
  static async onEnter({ repoStore, appStore, runtimeStore }, { repoId }) {
    await repoStore.fetchRepoDetail(repoId);
    await appStore.fetchAll({ repo_id: repoId });
    await runtimeStore.fetchAll({ repo_id: repoId });
    repoStore.curTagName = 'Apps';
  }

  changeselectors = items => {
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
    const { repoStore, appStore, runtimeStore } = this.props;
    const repoDetail = toJS(repoStore.repoDetail);
    const appsData = toJS(appStore.apps);
    const appCount = appStore.totalCount;
    const runtimesData = toJS(runtimeStore.runtimes);
    const appsColumns = [
      {
        title: 'App Name',
        dataIndex: 'name',
        key: 'name',
        width: '205px',
        render: (name, obj) => (
          <TdName
            name={name}
            description={obj.app_id}
            image={obj.icon}
            linkUrl={`/dashboard/app/${obj.app_id}`}
          />
        )
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '130px',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Categories',
        dataIndex: 'categories',
        key: 'categories'
      },
      {
        title: 'Developer',
        dataIndex: 'developer',
        key: 'developer'
      },
      {
        title: 'Visibility',
        dataIndex: 'visibility',
        key: 'visibility'
      },
      {
        title: 'Updated At',
        dataIndex: 'status_time',
        key: 'update_time',
        render: getParseDate
      }
    ];
    const runtimesColumns = [
      {
        title: 'Runtime Name',
        dataIndex: 'name',
        key: 'name',
        width: '130px',
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
        width: '130px',
        render: text => <Status type={text} name={text} />
      },
      {
        title: 'Provider',
        dataIndex: 'provider',
        key: 'provider'
      },
      {
        title: 'Zone',
        dataIndex: 'zone',
        key: 'zone'
      },
      {
        title: 'User',
        dataIndex: 'owner',
        key: 'owner'
      },
      {
        title: 'Updated At',
        dataIndex: 'status_time',
        key: 'status_time',
        render: getParseDate
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
        selectors = this.changeselectors(repoDetail.selectors);
        totalCount = runtimeStore.totalCount;
        changeTable = async current => {
          await runtimeStore.fetchAll({
            repo_id: repoDetail.repo_id,
            offset: (current - 1) * runtimeStore.pageSize
          });
        };
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
              <Table columns={columns} dataSource={data} />
            </div>
            {totalCount > 0 && <Pagination onChange={changeTable} total={totalCount} />}
          </div>
        </div>
      </Layout>
    );
  }
}
