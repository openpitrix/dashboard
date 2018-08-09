import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get, pick } from 'lodash';
import { translate } from 'react-i18next';

import { Icon, Table, Popover } from 'components/Base';
import TagNav from 'components/TagNav';
import TagShow from 'components/TagShow';
import Toolbar from 'components/Toolbar';
import RuntimeCard from 'components/DetailCard/RuntimeCard';
import Layout, { BackBtn, Grid, Section, Panel, Card, Dialog } from 'components/Layout';
import { ProviderName } from 'components/TdName';
import appColumns from './tabs/app-columns';
import runtimesColumns from './tabs/runtime-columns';
import eventsColumns from './tabs/event-columns';

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
  }

  constructor(props) {
    super(props);
    props.repoStore.setSocketMessage();
    this.props.repoStore.loadPageInit();
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
    return items.filter(item => item.selector_key).map(item => ({
      label_key: item.selector_key,
      label_value: item.selector_value
    }));
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

  changeDetailTab = async tab => {
    const { appStore, runtimeStore, repoStore, clusterStore, match } = this.props;
    const { repoId } = match.params;
    repoStore.curTagName = tab;

    if (tab === 'Apps') {
      appStore.searchWord = '';
      await appStore.fetchAll({ repo_id: repoId });
    } else if (tab === 'Runtimes') {
      runtimeStore.searchWord = '';
      const labels = repoStore.repoDetail.labels || [];
      const queryLabel = labels
        .filter(label => label.label_key)
        .map(label => [label.label_key, label.label_value].join('='))
        .join('&');
      repoStore.queryLabel = queryLabel;
      repoStore.queryProviders = repoStore.repoDetail.providers;
      await runtimeStore.fetchAll({
        label: queryLabel,
        provider: repoStore.repoDetail.providers
      });
      if (!clusterStore.clusters.length) {
        await clusterStore.fetchAll();
      }
    } else if (tab === 'Events') {
      await repoStore.fetchRepoEvents({ repo_id: repoId });
    }
  };

  onSearchApp = async name => {
    const { changeSearchWord, fetchAll } = this.props.appStore;
    const { repoDetail } = this.props.repoStore;
    changeSearchWord(name);
    await fetchAll({
      repo_id: repoDetail.repo_id
    });
  };

  onClearApp = async () => {
    await this.onSearchApp('');
  };

  onRefreshApp = async () => {
    const { fetchAll, searchWord, currentPage, pageSize } = this.props.appStore;
    const { repoDetail } = this.props.repoStore;
    await fetchAll({
      repo_id: repoDetail.repo_id,
      search_word: searchWord,
      offset: (currentPage - 1) * pageSize
    });
  };

  changeTableApp = async current => {
    const { setCurrentPage, fetchAll, currentPage, pageSize } = this.props.appStore;
    const { repoDetail } = this.props.repoStore;
    setCurrentPage(current);
    await fetchAll({
      repo_id: repoDetail.repo_id,
      offset: (currentPage - 1) * pageSize
    });
  };

  onChangeStatusApp = async status => {
    const { appStore, repoStore } = this.props;
    appStore.selectStatus = appStore.selectStatus === status ? '' : status;
    await appStore.fetchAll({
      repo_id: repoStore.repoDetail.repo_id,
      status: appStore.selectStatus
    });
  };

  onSearch = async name => {
    const { runtimeStore, repoStore } = this.props;
    runtimeStore.changeSearchWord(name);
    await runtimeStore.fetchAll({
      label: repoStore.queryLabel,
      provider: repoStore.queryProviders
    });
  };

  onClear = async () => {
    await this.onSearch('');
  };

  onRefresh = async () => {
    const { runtimeStore, repoStore } = this.props;
    await runtimeStore.fetchAll({
      label: repoStore.queryLabel,
      provider: repoStore.queryProviders,
      search_word: runtimeStore.searchWord,
      offset: (runtimeStore.currentPage - 1) * runtimeStore.pageSize
    });
  };

  changeTable = async current => {
    const { runtimeStore, repoStore } = this.props;
    runtimeStore.setCurrentPage(current);
    await runtimeStore.fetchAll({
      label: repoStore.queryLabel,
      provider: repoStore.queryProviders,
      offset: (current - 1) * runtimeStore.pageSize
    });
  };

  onChangeStatus = async status => {
    const { runtimeStore, repoStore } = this.props;
    runtimeStore.selectStatus = runtimeStore.selectStatus === status ? '' : status;
    await runtimeStore.fetchAll({
      label: repoStore.queryLabel,
      provider: repoStore.queryProviders,
      status: runtimeStore.selectStatus
    });
  };

  changeTableEvent = async current => {
    const { repoStore, match } = this.props;
    const { repoId } = match.params;
    repoStore.setCurrentPage(current);
    await repoStore.fetchRepoEvents({
      repo_id: repoId,
      offset: (current - 1) * repoStore.pageSize
    });
  };

  renderToolbar(options = {}) {
    return (
      <Toolbar
        {...pick(options, ['searchWord', 'onSearch', 'onClear', 'onRefresh', 'placeholder'])}
      />
    );
  }
  renderTable(options = {}) {
    return (
      <Table
        {...pick(options, ['columns', 'dataSource', 'isLoading', 'filterList', 'pagination'])}
      />
    );
  }

  render() {
    const { repoStore, appStore, runtimeStore, clusterStore, t } = this.props;
    const { repoDetail, curTagName, sockMessage } = repoStore;
    const appCount = appStore.totalCount;
    const clusters = clusterStore.clusters.toJSON();
    let selectors = [];
    let toolbarOptions, tableOptions;

    switch (curTagName) {
      case 'Apps':
        toolbarOptions = {
          searchWord: appStore.searchWord,
          placeholder: t('Search App'),
          onSearch: this.onSearchApp,
          onClear: this.onClearApp,
          onRefresh: this.onRefreshApp
        };
        tableOptions = {
          columns: appColumns,
          dataSource: appStore.apps.toJSON(),
          isLoading: appStore.isLoading,
          filterList: [
            {
              key: 'status',
              conditions: [
                { name: t('Active'), value: 'active' },
                { name: t('Deleted'), value: 'deleted' }
              ],
              onChangeFilter: this.onChangeStatusApp,
              selectValue: appStore.selectStatus
            }
          ],
          pagination: {
            tableType: 'Apps',
            onChange: this.changeTableApp,
            total: appStore.totalCount,
            current: appStore.currentPage
          }
        };
        break;
      case 'Runtimes':
        selectors = this.changeSelectors(repoDetail.selectors || []);
        toolbarOptions = {
          searchWord: runtimeStore.searchWord,
          placeholder: t('Search Runtimes'),
          onSearch: this.onSearch,
          onClear: this.onClear,
          onRefresh: this.onRefresh
        };
        tableOptions = {
          columns: runtimesColumns(clusters),
          dataSource: runtimeStore.runtimes.toJSON(),
          isLoading: runtimeStore.isLoading,
          filterList: [
            {
              key: 'status',
              conditions: [
                { name: t('Active'), value: 'active' },
                { name: t('Deleted'), value: 'deleted' }
              ],
              onChangeFilter: this.onChangeStatus,
              selectValue: runtimeStore.selectStatus
            }
          ],
          pagination: {
            tableType: 'Runtimes',
            onChange: this.changeTable,
            total: runtimeStore.totalCount,
            current: runtimeStore.currentPage
          }
        };
        break;
      case 'Events':
        tableOptions = {
          columns: eventsColumns,
          dataSource: repoStore.repoEvents.toJSON(),
          isLoading: repoStore.isLoading,
          pagination: {
            tableType: 'Events',
            onChange: this.changeTableEvent,
            total: repoStore.totalCount,
            current: repoStore.currentPage
          }
        };
        break;
    }

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
                changeTag={this.changeDetailTab}
              />
              <Card>
                {curTagName === 'Runtimes' &&
                  selectors.length > 0 && (
                    <div className={styles.selector}>
                      <div className={styles.title}>{t('Runtime Selectors')}</div>
                      <TagShow tags={selectors} tagStyle="yellow" />
                    </div>
                  )}
                {curTagName !== 'Events' && this.renderToolbar(toolbarOptions)}
                {this.renderTable(tableOptions)}
              </Card>
              {this.deleteRepoModal()}
            </Panel>
          </Section>
        </Grid>
      </Layout>
    );
  }
}
