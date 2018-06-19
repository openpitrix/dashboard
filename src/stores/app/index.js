import { observable, action } from 'mobx';
import Store from '../Store';
import { get, assign } from 'lodash';

export default class AppStore extends Store {
  @observable apps = [];
  @observable appDetail = {};
  @observable summaryInfo = {}; // replace original statistic
  @observable appId = ''; // current app_id
  @observable isLoading = false;
  @observable totalCount = 0;
  @observable currentPage = 1;
  @observable isModalOpen = false;

  // menu actions logic
  @observable
  handleApp = {
    action: '', // delete, modify
    selectedCategory: '' // category id
  };

  @action
  async fetchAll(params = {}) {
    let pageOffset = params.page || 1;
    let defaultParams = {
      limit: this.pageSize,
      offset: (pageOffset - 1) * this.pageSize,
      sort_key: 'update_time',
      reverse: true
    };
    this.isLoading = true;
    if (params.page) {
      delete params.page;
    }
    const result = await this.request.get('apps', assign(defaultParams, params));
    this.apps = get(result, 'app_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  }

  @action
  async fetch(appId = '') {
    this.isLoading = true;
    const result = await this.request.get(`apps`, { app_id: appId });
    this.appDetail = get(result, 'app_set[0]', {});
    this.isLoading = false;
  }

  @action
  async onRefresh() {
    await this.fetchAll();
    this.currentPage = 1;
  }

  @action
  async onSearch(value) {
    await this.fetchAll({
      search_word: value
    });
  }

  @action
  async onChangePage(page) {
    this.currentPage = page;
    await this.fetchAll({
      page: page
    });
  }

  @action
  async create(params = {}) {
    this.isLoading = true;
    await this.request.post('apps', params);
    this.isLoading = false;
  }

  @action
  async modify(params = {}) {
    this.isLoading = true;
    await this.request.patch('apps', params);
    this.isLoading = false;
  }

  @action
  async remove(params = {}) {
    this.isLoading = true;
    const result = await this.request.delete('apps', { app_id: [this.appId] });
    this.isLoading = false;
    this.hideModal();
    this.apiMsg(result);

    // todo: no need re-fetch
    if (!result || !result.err) {
      await this.fetchAll();
    }
  }

  @action
  changeAppCate = value => {
    this.handleApp.selectedCategory = value;
  };

  @action
  async modifyCategoryById() {
    if (!this.handleApp.selectedCategory) {
      this.showMsg('please select a category');
      return;
    }
    this.isLoading = true;
    const result = await this.modify({
      category_id: this.handleApp.selectedCategory,
      app_id: this.appId
    });
    this.isLoading = false;
    this.hideModal();
    this.apiMsg(result);
    if (!result || !result.err) {
      await this.fetchAll();
    }
  }

  // app menu actions
  @action
  showModal = () => {
    this.isModalOpen = true;
  };

  @action
  hideModal = () => {
    this.isModalOpen = false;
  };

  setActionType = type => {
    this.handleApp.action = type;
  };

  @action
  showDeleteApp = app_id => {
    this.appId = app_id;
    this.showModal();
    this.setActionType('delete_app');
  };

  @action
  showModifyAppCate = app_id => {
    this.appId = app_id;
    this.showModal();
    this.setActionType('modify_cate');
  };
}

export Deploy from './deploy';
export Version from './version';
