import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { Icon, Button, Input, Table, Pagination, Popover, Modal } from 'components/Base';
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
  clusterStore: rootStore.clusterStore,
  runtimeStore: rootStore.runtimeStore
}))
@observer
export default class RepoDetail extends Component {
  static async onEnter({ repoStore, appStore, runtimeStore, clusterStore }, { repoId }) {
    await repoStore.fetchRepoDetail(repoId);
    await repoStore.fetchRepoEvents({ repo_id: repoId });
    await appStore.fetchAll({
      repo_id: repoId,
      status: ['active', 'deleted']
    });
    await runtimeStore.fetchAll({
      repo_id: repoId,
      status: ['active', 'deleted']
    });
    await clusterStore.fetchAll({
      repo_id: repoId,
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
    const { deleteRepoOpen } = this.props.repoStore;
    return (
      <div className="operate-menu">
        <Link to={`/dashboard/repo/edit/${id}`}>Modify repo</Link>
        <span onClick={() => deleteRepoOpen(id)}>Delete Repo</span>
      </div>
    );
  };

  deleteRepoModal = () => {
    const { showDeleteRepo, deleteRepoClose, deleteRepo } = this.props.repoStore;
    return (
      <Modal
        width={500}
        title="Delete Repo"
        visible={showDeleteRepo}
        hideFooter
        onCancel={deleteRepoClose}
      >
        <div className={styles.modalContent}>
          <div className={styles.noteWord}>Are you sure delete this Repo?</div>
          <div className={styles.operation}>
            <Button type="default" onClick={deleteRepoClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                deleteRepo(this.props.repoStore);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  render() {
    const { repoStore, appStore, runtimeStore, clusterStore } = this.props;
    const repoDetail = repoStore.repoDetail;
    const appsData = appStore.apps.toJSON();
    const appCount = appStore.totalCount;
    const runtimesData = runtimeStore.runtimes.toJSON();
    const clusters = clusterStore.clusters.toJSON();
    const eventsData = repoStore.repoEvents.toJSON();

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

    const { curTagName, selectCurTag } = repoStore;
    const detailSearch = '';
    const tags = [{ id: 1, name: 'Apps' }, { id: 2, name: 'Runtimes' }, { id: 3, name: 'Events' }];

    let data = [];
    let columns = [];
    let searchTip = 'Search App Name';
    let totalCount = 0;
    let onSearch, onClearSearch, onRefresh, changeTable, isLoading, onChangeStatus, selectStatus;
    let selectors = [];

    switch (curTagName) {
      case 'Apps':
        const { fetchAll, changeSearchWord, searchWord } = appStore;
        data = appsData;
        columns = appsColumns;
        totalCount = appStore.totalCount;
        isLoading = appStore.isLoading;
        onSearch = async name => {
          changeSearchWord(name);
          await fetchAll({
            status: ['active', 'deleted'],
            repo_id: repoDetail.repo_id
          });
        };
        onClearSearch = async () => {
          await onSearch('');
        };
        onRefresh = async () => {
          await fetchAll({
            status: ['active', 'deleted'],
            repo_id: repoDetail.repo_id,
            search_word: searchWord
          });
        };
        changeTable = async current => {
          await fetchAll({
            status: ['active', 'deleted'],
            repo_id: repoDetail.repo_id,
            offset: (current - 1) * appStore.pageSize
          });
        };
        onChangeStatus = async status => {
          appStore.selectStatus = appStore.selectStatus === status ? '' : status;
          await appStore.fetchAll({
            repo_id: repoDetail.repo_id,
            status: appStore.selectStatus
          });
        };
        selectStatus = appStore.selectStatus;
        break;
      case 'Runtimes':
        data = runtimesData;
        columns = runtimesColumns;
        searchTip = 'Search Runtime Name';
        selectors = this.changeSelectors(repoDetail.selectors);
        totalCount = runtimeStore.totalCount;
        isLoading = runtimeStore.isLoading;
        onSearch = async name => {
          runtimeStore.changeSearchWord(name);
          await runtimeStore.fetchAll({
            status: ['active', 'deleted'],
            repo_id: repoDetail.repo_id
          });
        };
        onClearSearch = async () => {
          await onSearch('');
        };
        onRefresh = async () => {
          await runtimeStore.fetchAll({
            status: ['active', 'deleted'],
            repo_id: repoDetail.repo_id,
            search_word: searchWord
          });
        };
        changeTable = async current => {
          await runtimeStore.fetchAll({
            status: ['active', 'deleted'],
            repo_id: repoDetail.repo_id,
            offset: (current - 1) * runtimeStore.pageSize
          });
        };
        onChangeStatus = async status => {
          runtimeStore.selectStatus = runtimeStore.selectStatus === status ? '' : status;
          await runtimeStore.fetchAll({
            repo_id: repoDetail.repo_id,
            status: runtimeStore.selectStatus
          });
        };
        selectStatus = runtimeStore.selectStatus;
        break;
      case 'Events':
        data = eventsData;
        columns = eventsColumns;
        totalCount = eventsData.length;
        isLoading = repoStore.isLoading;
        searchTip = 'Search Events';
        onChangeStatus = async status => {
          repoStore.eventStatus = repoStore.eventStatus === status ? '' : status;
          await repoStore.fetchRepoEvents({
            repo_id: repoDetail.repo_id,
            status: repoStore.eventStatus
          });
        };
        selectStatus = repoStore.eventStatus;
        break;
    }

    let filterList = [
      {
        key: 'status',
        conditions:
          curTagName === 'Events'
            ? [{ name: 'Successful', value: 'successful' }, { name: 'Deleted', value: 'deleted' }]
            : [{ name: 'Active', value: 'active' }, { name: 'Deleted', value: 'deleted' }],
        onChangeFilter: onChangeStatus,
        selectValue: selectStatus
      }
    ];

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
              <TagNav tags={tags} curTag={curTagName} changeTag={selectCurTag.bind(repoStore)} />
              {curTagName === 'Runtimes' && (
                <div className={styles.selector}>
                  <div className={styles.title}>Runtime Selectors</div>
                  <TagShow tags={selectors} tagStyle="yellow" />
                </div>
              )}

              {curTagName !== 'Events' && (
                <div className={styles.toolbar}>
                  <Input.Search
                    className={styles.search}
                    placeholder={searchTip}
                    onSearch={onSearch}
                    onClear={onClearSearch}
                    value={detailSearch}
                  />
                  <Button className={styles.buttonRight} onClick={onRefresh}>
                    <Icon name="refresh" />
                  </Button>
                </div>
              )}

              <Table
                columns={columns}
                dataSource={data}
                className="detailTab"
                isLoading={isLoading}
                filterList={filterList}
              />
            </div>
            <Pagination onChange={changeTable} total={totalCount} />
          </div>
        </div>
        {this.deleteRepoModal()}
      </Layout>
    );
  }
}
