import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';

import RuntimeCard from 'components/DetailCard/RuntimeCard';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import Table from 'components/Base/Table';
import Pagination from 'components/Base/Pagination';
import Popover from 'components/Base/Popover';
import TdName from 'components/TdName';
import TagShow from 'components/TagShow';
import Layout, { BackBtn } from 'pages/Layout/Admin';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  repoStore: rootStore.repoStore,
  handleStore: rootStore.repoHandleStore,
  appStore: rootStore.appStore,
  runtimeStore: rootStore.runtimeStore
}))
@observer
export default class RepoDetail extends Component {
  static async onEnter({ repoStore, appStore, runtimeStore }, { repoId }) {
    await repoStore.fetchRepoDetail(repoId);
    await appStore.fetchQueryApps({ repo_id: repoId });
    await runtimeStore.fetchQueryRuntimes({ repo_id: repoId });
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
        <Link to={`/manage/repos/modify/${id}`}>Modify repo</Link>
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
        width: '150px',
        render: (name, obj) => <TdName name={name} description={obj.description} image={obj.icon} />
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
        dataIndex: 'update_time',
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
        render: (name, obj) => <TdName name={name} description={obj.description} />
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
        dataIndex: 'update_time',
        key: 'update_time',
        render: getParseDate
      }
    ];

    const { tags, curTagName, selectCurTag } = this.props.handleStore;
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
          await appStore.fetchQueryApps({
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
          await runtimeStore.fetchQueryRuntimes({
            repo_id: repoDetail.repo_id,
            offset: (current - 1) * runtimeStore.pageSize
          });
        };
        break;
    }

    return (
      <Layout>
        <BackBtn label="repos" link="/manage/repos" />
        <div className={styles.wrapper}>
          <div className={styles.leftInfo}>
            <div className={styles.detailOuter}>
              <RuntimeCard detail={repoDetail} appCount={appCount} />
              <Popover
                className={styles.operation}
                content={this.renderHandleMenu(repoDetail.repo_id)}
              >
                <Icon name="more" />
              </Popover>
            </div>
          </div>
          <div className={styles.rightInfo}>
            <div className={styles.wrapper2}>
              <TagNav tags={tags} curTag={curTagName} changeCurTag={selectCurTag} />
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
