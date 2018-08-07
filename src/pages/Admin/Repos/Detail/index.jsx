import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { translate } from 'react-i18next';

import { Icon, Table, Pagination, Popover } from 'components/Base';
import Status from 'components/Status';
import TagNav from 'components/TagNav';
import TdName from 'components/TdName';
import TagShow from 'components/TagShow';
import Toolbar from 'components/Toolbar';
import RuntimeCard from 'components/DetailCard/RuntimeCard';
import Layout, { BackBtn, Grid, Section, Panel, Card, Dialog } from 'components/Layout';
import { ProviderName } from 'components/TdName';
import TimeShow from 'components/TimeShow';

import styles from './index.scss';

@translate()
@inject(({ rootStore, sock }) => ({
  repoStore: rootStore.repoStore,
  appStore: rootStore.appStore,
  clusterStore: rootStore.clusterStore,
  runtimeStore: rootStore.runtimeStore,
  sock
}))
@observer
export default class RepoDetail extends Component {
  static async onEnter({ repoStore, appStore, runtimeStore, clusterStore }, { repoId }) {
    await repoStore.fetchRepoDetail(repoId);
    await repoStore.fetchRepoEvents({ repo_id: repoId });
    await appStore.fetchAll({
      repo_id: repoId
    });
    const labels = repoStore.repoDetail.labels || [];
    const queryLabel = labels
      .filter(label => label.label_key)
      .map(label => [label.label_key, label.label_value].join('='))
      .join('&');
    await runtimeStore.fetchAll({
      repo_id: repoId,
      label: queryLabel,
      provider: repoStore.repoDetail.providers
    });
    await clusterStore.fetchAll({
      repo_id: repoId
    });
    repoStore.curTagName = 'Apps';
  }

  constructor(props) {
    super(props);
    props.repoStore.setSocketMessage();
  }

  listenToJob = async payload => {
    const { repoStore, match } = this.props;
    const rtype = get(payload, 'resource.rtype');
    const rid = get(payload, 'resource.rid');

    const { repoId } = match.params;

    if (rtype === 'repo_event' && rid === repoId) {
      if (repoStore.sockMessageChanged(payload)) {
        await repoStore.fetchRepoDetail(repoId);
        await repoStore.fetchRepoEvents({ repo_id: repoId });
      }
      repoStore.setSocketMessage(payload);
    }
  };

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
    const { t } = this.props;
    const { deleteRepoOpen, startIndexer } = this.props.repoStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/repo/edit/${id}`}>{t('Modify Repo')}</Link>
        <span onClick={() => startIndexer(id)}>{t('Trigger indexer')}</span>
        <span onClick={() => deleteRepoOpen(id)}>{t('Delete Repo')}</span>
      </div>
    );
  };

  deleteRepoModal = () => {
    const { t } = this.props;
    const { showDeleteRepo, deleteRepoClose, deleteRepo } = this.props.repoStore;

    return (
      <Dialog
        title={t('Delete Repo')}
        isOpen={showDeleteRepo}
        onCancel={deleteRepoClose}
        onSubmit={deleteRepo}
      >
        {t('Delete Repo desc')}
      </Dialog>
    );
  };

  render() {
    const { repoStore, appStore, runtimeStore, clusterStore, t } = this.props;
    const repoDetail = repoStore.repoDetail;
    const appsData = appStore.apps.toJSON();
    const appCount = appStore.totalCount;
    const runtimesData = runtimeStore.runtimes.toJSON();
    const clusters = clusterStore.clusters.toJSON();
    const eventsData = repoStore.repoEvents.toJSON();

    const { sockMessage } = repoStore;

    const appsColumns = [
      {
        title: t('App Name'),
        key: 'name',
        width: '190px',
        render: item => (
          <TdName
            name={item.name}
            description={item.app_id}
            image={item.icon || 'appcenter'}
            linkUrl={`/dashboard/app/${item.app_id}`}
          />
        )
      },
      {
        title: t('Latest Version'),
        key: 'latest_version',
        width: '116px',
        render: item => get(item, 'latest_app_version.name', '')
      },
      {
        title: t('Status'),
        key: 'status',
        width: '100px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: t('Categories'),
        key: 'category',
        render: item =>
          get(item, 'category_set', [])
            .filter(cate => cate.category_id && cate.status === 'enabled')
            .map(cate => cate.name)
            .join(', ')
      },
      {
        title: t('Developer'),
        key: 'owner',
        render: item => item.owner
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '95px',
        render: item => <TimeShow time={item.status_time} />
      }
    ];
    const runtimesColumns = [
      {
        title: t('Runtime Name'),
        key: 'name',
        width: '155px',
        render: item => (
          <TdName
            name={item.name}
            description={item.runtime_id}
            linkUrl={`/dashboard/runtime/${item.runtime_id}`}
          />
        )
      },
      {
        title: t('Status'),
        key: 'status',
        width: '100px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: t('Provider'),
        key: 'provider',
        render: item => <ProviderName provider={item.provider} name={item.provider} />
      },
      {
        title: t('Zone'),
        key: 'zone',
        render: item => item.zone
      },
      {
        title: t('Cluster Count'),
        key: 'node_count',
        render: item => clusters.filter(cluster => item.runtime_id === cluster.runtime_id).length
      },
      {
        title: t('User'),
        key: 'owner',
        render: item => item.owner
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '95px',
        render: item => <TimeShow time={item.status_time} />
      }
    ];
    const eventsColumns = [
      {
        title: t('Event Id'),
        key: 'repo_event_id',
        render: item => item.repo_event_id
      },
      {
        title: t('Status'),
        key: 'status',
        render: item => item.status
      },
      {
        title: t('User'),
        key: 'owner',
        render: item => item.owner
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '95px',
        render: item => <TimeShow time={item.status_time} />
      }
    ];

    const { curTagName, selectCurTag } = repoStore;
    const detailSearch = '';

    let data = [];
    let columns = [];
    let searchTip = t('Search App');
    let totalCount = 0,
      currentPage = 1;
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
            repo_id: repoDetail.repo_id
          });
        };
        onClearSearch = async () => {
          await onSearch('');
        };
        onRefresh = async () => {
          await fetchAll({
            repo_id: repoDetail.repo_id,
            search_word: searchWord
          });
        };
        changeTable = async current => {
          appStore.setCurrentPage(current);
          await fetchAll({
            repo_id: repoDetail.repo_id,
            offset: (current - 1) * appStore.pageSize
          });
        };
        currentPage = appStore.currentPage;
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
        searchTip = t('Search Runtimes');
        selectors = this.changeSelectors(repoDetail.selectors);
        totalCount = runtimeStore.totalCount;
        isLoading = runtimeStore.isLoading;
        onSearch = async name => {
          runtimeStore.changeSearchWord(name);
          await runtimeStore.fetchAll({
            repo_id: repoDetail.repo_id
          });
        };
        onClearSearch = async () => {
          await onSearch('');
        };
        onRefresh = async () => {
          await runtimeStore.fetchAll({
            repo_id: repoDetail.repo_id,
            search_word: searchWord
          });
        };
        changeTable = async current => {
          runtimeStore.setCurrentPage(current);
          await runtimeStore.fetchAll({
            repo_id: repoDetail.repo_id,
            offset: (current - 1) * runtimeStore.pageSize
          });
        };
        currentPage = runtimeStore.currentPage;
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
        searchTip = t('Search Events');
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
            ? [
                { name: t('Successful'), value: 'successful' },
                { name: t('Deleted'), value: 'deleted' }
              ]
            : [{ name: t('Active'), value: 'active' }, { name: t('Deleted'), value: 'deleted' }],
        onChangeFilter: onChangeStatus,
        changeTable: () => {},
        selectValue: selectStatus
      }
    ];

    const pagination = {
      tableType: curTagName,
      onChange: changeTable,
      total: totalCount,
      current: currentPage
    };

    return (
      <Layout
        backBtn={<BackBtn label="repos" link="/dashboard/repos" />}
        sockMessage={sockMessage}
        listenToJob={this.listenToJob}
      >
        <Grid>
          <Section>
            <Card>
              <RuntimeCard detail={repoDetail} appCount={appCount} />
              {repoDetail.status !== 'deleted' && (
                <Popover className="operation" content={this.renderHandleMenu(repoDetail.repo_id)}>
                  <Icon name="more" />
                </Popover>
              )}
            </Card>
          </Section>
          <Section size={8}>
            <Panel>
              <TagNav
                tags={['Apps', 'Runtimes', 'Events']}
                defaultTag={curTagName}
                changeTag={selectCurTag.bind(repoStore)}
              />
              <Card>
                {curTagName === 'Runtimes' && (
                  <div className={styles.selector}>
                    <div className={styles.title}>{t('Runtime Selectors')}</div>
                    <TagShow tags={selectors} tagStyle="yellow" />
                  </div>
                )}

                {curTagName !== 'Events' && (
                  <Toolbar
                    placeholder={searchTip}
                    searchWord={detailSearch}
                    onSearch={onSearch}
                    onClear={onClearSearch}
                    onRefresh={onRefresh}
                  />
                )}

                <Table
                  columns={columns}
                  dataSource={data}
                  isLoading={isLoading}
                  filterList={filterList}
                  pagination={pagination}
                />
              </Card>
              {this.deleteRepoModal()}
            </Panel>
          </Section>
        </Grid>
      </Layout>
    );
  }
}
