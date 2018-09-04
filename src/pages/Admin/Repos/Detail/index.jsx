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
      appStore.repoId = repoId;
      await appStore.fetchAll();
    } else if (tab === 'Runtimes') {
      // query runtime label by repo selector
      repoStore.querySelector = repoStore.getStringFor('selectors');
      repoStore.queryProviders = repoStore.repoDetail.providers.slice();

      await runtimeStore.fetchAll(this.getRuntimeParams());

      const { runtimes } = runtimeStore;
      if (runtimes.length > 0) {
        const runtimeIds = runtimes.map(item => item.runtime_id);
        await clusterStore.fetchAll({
          runtime_id: runtimeIds,
          noLimit: true
        });
      }
    } else if (tab === 'Events') {
      await repoStore.fetchRepoEvents({ repo_id: repoId });
    }
  };

  onSearch = async (name = '', isRefresh = false) => {
    const { runtimeStore } = this.props;

    if (!isRefresh) {
      runtimeStore.searchWord = name;
      runtimeStore.currentPage = 1;
    }

    await runtimeStore.fetchAll(this.getRuntimeParams());
  };

  onClear = async () => {
    await this.onSearch();
  };

  onRefresh = async () => {
    await this.onSearch('', true);
  };

  changePagination = async page => {
    const { runtimeStore } = this.props;
    runtimeStore.currentPage = page;
    await runtimeStore.fetchAll(this.getRuntimeParams());
  };

  onChangeStatus = async status => {
    const { runtimeStore } = this.props;
    runtimeStore.selectStatus = runtimeStore.selectStatus === status ? '' : status;
    runtimeStore.currentPage = 1;

    await runtimeStore.fetchAll(this.getRuntimeParams());
  };

  changePaginationEvent = async page => {
    const { repoStore, match } = this.props;
    const { repoId } = match.params;
    repoStore.currentEventPage = page;
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
          onSearch: appStore.onSearch,
          onClear: appStore.onClearSearch,
          onRefresh: appStore.onRefresh
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
              onChangeFilter: appStore.onChangeStatus,
              selectValue: appStore.selectStatus
            }
          ],
          pagination: {
            tableType: 'Apps',
            onChange: appStore.changePagination,
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
            onChange: this.changePagination,
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
            onChange: this.changePaginationEvent,
            total: repoStore.totalEventCount,
            current: repoStore.currentEventPage
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
