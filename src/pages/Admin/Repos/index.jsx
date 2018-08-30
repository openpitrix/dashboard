import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get, throttle } from 'lodash';
import { translate } from 'react-i18next';

import { getScrollTop } from 'utils';
import Layout, { Dialog } from 'components/Layout';
import Toolbar from 'components/Toolbar';
import RepoList from './RepoList';
import Loading from 'components/Loading';

import styles from './index.scss';

@translate()
@inject(({ rootStore, sock }) => ({
  rootStore,
  repoStore: rootStore.repoStore,
  appStore: rootStore.appStore,
  sock
}))
@observer
export default class Repos extends Component {
  static async onEnter({ repoStore, appStore }) {
    repoStore.appStore = appStore;
    await repoStore.fetchAll({ noLimit: true }, appStore);
  }

  constructor(props) {
    super(props);
    const { repoStore, appStore } = this.props;
    repoStore.setSocketMessage();
    repoStore.loadPageInit();
    appStore.loadPageInit();
  }

  componentDidMount() {
    window.scroll({ top: 0, behavior: 'auto' });
    window.onscroll = throttle(this.handleScroll, 200);
  }

  componentWillUnmount() {
    if (window.onscroll) {
      window.onscroll = null;
    }
  }

  handleScroll = async () => {
    const { repoStore, appStore } = this.props;
    const { repos, initLoadNumber } = repoStore;
    const len = repos.length;
    const loadDataHeight = 150 + 24;

    if (len <= initLoadNumber || repos[len - 1].apps) {
      return;
    }

    let scrollTop = getScrollTop();
    let loadNumber = parseInt(scrollTop / loadDataHeight);
    for (let i = initLoadNumber; i < len && i < initLoadNumber + loadNumber; i++) {
      if (!repos[i].appFlag) {
        repoStore.repos[i].appFlag = true;
        await appStore.fetchAll({ repo_id: repos[i].repo_id });
        repoStore.repos[i] = { total: appStore.totalCount, apps: appStore.apps, ...repos[i] };
      }
    }
  };

  listenToJob = async payload => {
    const { repoStore } = this.props;

    if (['repo'].includes(get(payload, 'resource.rtype'))) {
      await repoStore.fetchAll();
      // repo_event: create, update, delete
      repoStore.setSocketMessage(payload);
    }
  };

  renderHandleMenu = id => {
    const { t } = this.props;
    const { deleteRepoOpen } = this.props.repoStore;
    return (
      <div id={id} className="operate-menu">
        <Link to={`/dashboard/repo/${id}`}>{t('View detail')}</Link>
        <Link to={`/dashboard/repo/edit/${id}`}>{t('Modify Repo')}</Link>
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
        visible={showDeleteRepo}
        onSubmit={deleteRepo}
        onCancel={deleteRepoClose}
      >
        {t('Delete Repo desc')}
      </Dialog>
    );
  };

  render() {
    const { t } = this.props;
    const {
      repos,
      isLoading,
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      sockMessage
    } = this.props.repoStore;

    return (
      <Layout sockMessage={sockMessage} listenToJob={this.listenToJob}>
        <div className={styles.container}>
          <div className={styles.title}>{t('Repos')}</div>

          <Toolbar
            placeholder={t('Search Repo')}
            searchWord={searchWord}
            onSearch={onSearch}
            onClear={onClearSearch}
            onRefresh={onRefresh}
            withCreateBtn={{ name: t('Create'), linkTo: `/dashboard/repo/create` }}
          />

          <Loading isLoading={isLoading}>
            <RepoList
              visibility="public"
              repos={repos.toJSON()}
              actionMenu={this.renderHandleMenu}
            />
            <RepoList
              visibility="private"
              repos={repos.toJSON()}
              actionMenu={this.renderHandleMenu}
            />
          </Loading>
        </div>
        {this.deleteRepoModal()}
      </Layout>
    );
  }
}
