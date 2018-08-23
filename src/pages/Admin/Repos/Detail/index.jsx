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
  static async onEnter({ repoStore }, { repoId }) {
    await repoStore.fetchRepoDetail(repoId);
  }

  constructor(props) {
    super(props);
    const { repoStore, appStore, runtimeStore, clusterStore } = this.props;
    repoStore.setSocketMessage();
    repoStore.curTagName = 'Apps';
    appStore.loadPageInit();
    runtimeStore.loadPageInit();
    clusterStore.loadPageInit();
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

  filterSelectors = items => {
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

  getRuntimeParams = () => {
    const { repoStore } = this.props;

    return {
      label: repoStore.querySelector,
      provider: repoStore.queryProviders
    };
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
      // query runtime label by repo selector
      repoStore.querySelector = repoStore.getStringFor('selectors');
      repoStore.queryProviders = repoStore.repoDetail.providers.slice();

      await runtimeStore.fetchAll(this.getRuntimeParams());

      const { runtimes } = runtimeStore;
      if (runtimes.length > 0) {
        const runtimeIds = runtimes.map(item => item.runtime_id);
        await clusterStore.fetchAll({
          //status: ['active', 'stopped', 'ceased', 'pending', 'suspended', 'deleted'],
          runtime_id: runtimeIds,
          limit: 200
        });
      }
    } else if (tab === 'Events') {
      await repoStore.fetchRepoEvents({ repo_id: repoId });
    }
  };

  onSearchApp = async name => {
    const { changeSearchWord, setCurrentPage, fetchAll } = this.props.appStore;
    const { repoDetail } = this.props.repoStore;
    changeSearchWord(name);
    setCurrentPage(1);
    await fetchAll({
      repo_id: repoDetail.repo_id
    });
  };

  onClearApp = async () => {
    await this.onSearchApp('');
  };

  onRefreshApp = async () => {
    const { fetchAll } = this.props.appStore;
    const { repoDetail } = this.props.repoStore;
    await fetchAll({
      repo_id: repoDetail.repo_id
    });
  };

  changeTableApp = async current => {
    const { setCurrentPage, fetchAll } = this.props.appStore;
    const { repoDetail } = this.props.repoStore;
    setCurrentPage(current);
    await fetchAll({
      repo_id: repoDetail.repo_id
    });
  };

  onChangeStatusApp = async status => {
    const { appStore, repoStore } = this.props;
    appStore.selectStatus = appStore.selectStatus === status ? '' : status;
    appStore.setCurrentPage(1);
    await appStore.fetchAll({
      repo_id: repoStore.repoDetail.repo_id
    });
  };

  onSearch = async (name = '', isRefresh = false) => {
    const { runtimeStore } = this.props;

    if (!isRefresh) {
      runtimeStore.changeSearchWord(name);
      runtimeStore.setCurrentPage(1);
    }

    await runtimeStore.fetchAll(this.getRuntimeParams());
  };

  onClear = async () => {
    await this.onSearch();
  };

  onRefresh = async () => {
    await this.onSearch('', true);
  };

  changeTable = async current => {
    const { runtimeStore } = this.props;
    runtimeStore.setCurrentPage(current);
    await runtimeStore.fetchAll(this.getRuntimeParams());
  };

  onChangeStatus = async status => {
    const { runtimeStore } = this.props;
    runtimeStore.selectStatus = runtimeStore.selectStatus === status ? '' : status;
    runtimeStore.setCurrentPage(1);

    await runtimeStore.fetchAll(this.getRuntimeParams());
  };

  changeTableEvent = async current => {
    const { repoStore, match } = this.props;
    const { repoId } = match.params;
    repoStore.setCurrentPage(current);
    await repoStore.fetchRepoEvents({
      repo_id: repoId
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
        selectors = this.filterSelectors(repoDetail.selectors || []);
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
              <RuntimeCard detail={repoDetail} appCount={appStore.appCount} />
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
