import { action } from 'mobx';
import { get, assign, orderBy } from 'lodash';

import Store from '../Store';

export default class RepoStore extends Store {
  constructor(...args) {
    super(...args);

    this.initLoadNumber = 3;
    this.defaultStatus = ['active'];

    this.defineObservables(function () {
      this.repos = [];

      this.repoEvents = [];

      this.repoDetail = {};

      this.isLoading = false;

      this.repoId = '';

      this.showDeleteRepo = false;

      this.curTagName = 'Apps';

      this.queryProviders = '';

      this.querySelector = '';

      this.currentPage = 1;

      // app table query params
      this.searchWord = '';

      this.selectStatus = '';

      this.userId = '';

      this.totalCount = 0;

      this.currentEventPage = 1;

      // events table query params
      this.totalEventCount = 0;

      this.appStore = null;

      this.jobs = {
        // repo_id=> {repo_event, repo_status}
      };
    });
  }

  @action
  fetchAll = async (params = {}, appStore) => {
    const defaultParams = {
      sort_key: 'status_time',
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
      status: this.selectStatus ? this.selectStatus : this.defaultStatus
    };

    if (params.noLimit) {
      defaultParams.limit = this.maxLimit;
      defaultParams.offset = 0;
      delete params.noLimit;
    }

    if (this.searchWord) {
      defaultParams.search_word = this.searchWord;
    }
    if (this.userId) {
      defaultParams.owner = this.userId;
    }

    this.isLoading = true;
    const result = await this.request.get(
      'repos',
      assign(defaultParams, params)
    );
    const repos = get(result, 'repo_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.repos = orderBy(
      repos,
      ['visibility', 'status_time'],
      ['desc', 'desc']
    );

    if (appStore) {
      for (let i = 0; i < this.initLoadNumber && i < this.repos.length; i++) {
        await appStore.fetchAll({ repo_id: this.repos[i].repo_id });
        this.repos[i] = {
          total: appStore.totalCount,
          apps: appStore.apps,
          ...this.repos[i]
        };
      }
    }

    this.isLoading = false;
  };

  @action
  onSearch = async word => {
    this.searchWord = word;
    this.currentPage = 1;
    await this.fetchAll({ noLimit: true }, this.appStore);
  };

  @action
  onClearSearch = async () => {
    await this.onSearch('');
  };

  @action
  onRefresh = async () => {
    await this.fetchAll({ noLimit: true }, this.appStore);
  };

  @action
  changePagination = async page => {
    this.currentPage = page;
    await this.fetchAll();
  };

  @action
  onChangeStatus = async status => {
    this.currentPage = 1;
    this.selectStatus = this.selectStatus === status ? '' : status;
    await this.fetchAll();
  };

  @action
  fetchRepoDetail = async repoId => {
    this.isLoading = true;
    const result = await this.request.get(`repos`, {
      repo_id: repoId
    });
    this.repoDetail = get(result, 'repo_set[0]', {});
    this.isLoading = false;
  };

  @action
  fetchRepoEvents = async (params = {}) => {
    this.isLoading = true;
    const defaultParams = {
      limit: this.pageSize,
      offset: (this.currentEventPage - 1) * this.pageSize
    };
    const result = await this.request.get(
      `repo_events`,
      assign(defaultParams, params)
    );
    this.repoEvents = get(result, 'repo_event_set', []);
    this.totalEventCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  deleteRepo = async () => {
    const result = await this.request.delete('repos', {
      repo_id: [this.repoId]
    });

    if (get(result, 'repo_id')) {
      this.deleteRepoClose();
      this.success('Delete repo successfully');

      if (this.repos.length) {
        await this.fetchAll({}, this.appStore);
      }
    } else {
      return result;
    }
  };

  // fixme
  @action
  deleteRepoOpen = repoId => {
    this.repoId = repoId;
    this.showDeleteRepo = true;
  };

  @action
  deleteRepoClose = () => {
    this.showDeleteRepo = false;
  };

  // @action
  // deleteRepo = async repoStore => {
  //   await repoStore.deleteRepo([this.repoId]);
  //   this.showDeleteRepo = false;
  //   await repoStore.fetchRepos();
  // };

  @action
  selectCurTag = tagName => {
    this.curTagName = tagName;
  };

  getRepoApps = (repos = [], apps = []) => {
    if (repos.toJSON) {
      repos = repos.toJSON();
    }
    if (apps.toJSON) {
      apps = apps.toJSON();
    }

    return repos.map(repo => {
      repo.apps = apps.filter(app => app.repo_id === repo.repo_id);
      return repo;
    });
  };

  @action
  startIndexer = async repoId => {
    const repoEvent = await this.request.post(`repos/index`, {
      repo_id: repoId
    });
    if (repoEvent.repo_id) {
      this.success(`${'Started repo indexer:'} ${repoEvent.repo_id}`);
    } else {
      this.error(`${'Start repo indexer failed:'} ${repoEvent.errDetail}`);
    }
  };

  @action
  setCurrentPage = page => {
    this.currentPage = page;
  };

  // get string representation for label / selector
  getStringFor = (type = 'selectors') => {
    if (!['selectors', 'labels'].includes(type)) {
      return '';
    }

    const itemKey = type === 'selectors' ? 'selector_key' : 'label_key';
    const itemValue = type === 'selectors' ? 'selector_value' : 'label_value';

    return get(this.repoDetail, type, [])
      .filter(item => Boolean(item[itemKey]))
      .map(item => `${item[itemKey]}=${item[itemValue]}`)
      .join('&');
  };
}

export Create from './create';
