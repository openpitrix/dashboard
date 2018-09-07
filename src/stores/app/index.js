import { observable, action } from 'mobx';
import Store from '../Store';
import { get, assign } from 'lodash';

export default class AppStore extends Store {
  @observable apps = [];
  @observable homeApps = []; //home page category apps
  @observable storeApps = []; //store page category apps
  @observable appDetail = {};
  @observable summaryInfo = {}; // replace original statistic
  @observable categoryTitle = '';
  @observable appId = ''; // current app_id
  @observable isLoading = false;
  @observable isProgressive = false;
  @observable totalCount = 0;
  @observable appCount = 0;

  @observable currentPage = 1; //app table query params
  @observable searchWord = '';
  defaultStatus = ['active'];
  @observable selectStatus = '';
  @observable repoId = '';
  @observable categoryId = '';
  @observable userId = '';

  @observable isModalOpen = false;
  @observable isDeleteOpen = false;
  @observable operateType = '';

  @observable appTitle = '';
  @observable appIds = [];
  @observable selectedRowKeys = [];

  @observable deleteResult = {};

  @observable detailTab = '';

  @observable currentPic = 1;

  // menu actions logic
  @observable
  handleApp = {
    action: '', // delete, modify
    selectedCategory: '' // category id
  };

  @action
  fetchApps = async (params = {}, title) => {
    this.isLoading = true;
    this.categoryTitle = title;
    params.limit = 200;

    if (!params.status) {
      params.status = ['active'];
    }

    const result = await this.request.get('apps', params);
    this.apps = get(result, 'app_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  fetchAll = async (params = {}) => {
    let defaultParams = {
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
    if (this.categoryId) {
      defaultParams.category_id = this.categoryId;
    }
    if (this.repoId) {
      defaultParams.repo_id = this.repoId;
    }
    if (this.userId) {
      defaultParams.user_id = this.userId;
    }

    if (!params.noLoading) {
      this.isLoading = true;
    } else {
      this.isProgressive = true;
      delete params.noLoading;
    }

    const result = await this.request.get('apps', assign(defaultParams, params));
    this.apps = get(result, 'app_set', []);
    this.totalCount = get(result, 'total_count', 0);
    if (!this.searchWord && !this.selectStatus) {
      this.appCount = this.totalCount;
    }
    this.isLoading = false;
    this.isProgressive = false;
  };

  @action
  appStatistics = async () => {
    //this.isLoading = true;
    const result = await this.request.get('apps/statistics');
    this.summaryInfo = {
      name: 'Apps',
      iconName: 'appcenter',
      centerName: 'Repos',
      total: get(result, 'app_count', 0),
      progressTotal: get(result, 'repo_count', 0),
      progress: get(result, 'top_ten_repos', {}),
      histograms: get(result, 'last_two_week_created', {})
    };
    //this.isLoading = false;
  };

  @action
  async fetch(appId = '') {
    this.isLoading = true;
    const result = await this.request.get(`apps`, { app_id: appId });
    this.appDetail = get(result, 'app_set[0]', {});
    this.isLoading = false;
    this.pageInitMap = { app: true };
  }

  @action
  create = async (params = {}) => {
    this.isLoading = true;
    await this.request.post('apps', params);
    this.isLoading = false;
  };

  @action
  modify = async (params = {}) => {
    // this.isLoading = true;
    return await this.request.patch('apps', params);
    // this.isLoading = false;
  };

  @action
  remove = async () => {
    this.appId = this.appId ? this.appId : this.appDetail.app_id;
    const ids = this.operateType === 'multiple' ? this.appIds.toJSON() : [this.appId];
    const result = await this.request.delete('apps', { app_id: ids });

    if (get(result, 'app_id')) {
      if (this.operateType === 'detailDelete') {
        this.appDetail = {};
        this.deleteResult = result;
        await this.fetch(this.appId);
      } else {
        this.hideModal();
        await this.fetchAll();
        this.cancelSelected();
      }
      this.success('Delete app successfully.');
    }
  };

  @action
  changeAppCate = value => {
    this.handleApp.selectedCategory = value;
  };

  @action
  modifyCategoryById = async () => {
    if (!this.handleApp.selectedCategory) {
      this.info('please select a category');
      return;
    }
    const result = await this.modify({
      category_id: this.handleApp.selectedCategory,
      app_id: this.appId
    });
    this.hideModal();

    if (!result.err) {
      this.success('Modify category successfully');
      await this.fetchAll();
    }
  };

  @action
  hideModal = () => {
    this.isDeleteOpen = false;
    this.isModalOpen = false;
  };

  @action
  showDeleteApp = appIds => {
    if (typeof appIds === 'string') {
      this.appId = appIds;
      this.operateType = 'single';
    } else {
      this.operateType = 'multiple';
    }
    this.isDeleteOpen = true;
  };

  @action
  showModifyAppCate = (app_id, category_set = []) => {
    this.appId = app_id;
    if ('toJSON' in category_set) {
      category_set = category_set.toJSON();
    }
    let availableCate = category_set.find(cate => cate.category_id && cate.status === 'enabled');
    this.handleApp.selectedCategory = get(availableCate, 'category_id', '');
    this.isModalOpen = true;
  };

  @action
  onSearch = async word => {
    this.searchWord = word;
    this.currentPage = 1;
    await this.fetchAll();
  };

  @action
  onClearSearch = async () => {
    await this.onSearch('');
  };

  @action
  onRefresh = async () => {
    await this.fetchAll();
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
  onChangeSelect = (selectedRowKeys, selectedRows) => {
    this.selectedRowKeys = selectedRowKeys;
    this.appIds = selectedRows.map(row => row.app_id);
  };

  @action
  cancelSelected = () => {
    this.selectedRowKeys = [];
    this.appIds = [];
  };

  loadPageInit = () => {
    if (!this.pageInitMap.app) {
      this.currentPage = 1;
      this.selectStatus = '';
      this.searchWord = '';
    }
    this.categoryId = '';
    this.repoId = '';
    this.userId = '';
    this.selectedRowKeys = [];
    this.appIds = [];
    this.pageInitMap = {};
  };
}

export Deploy from './deploy';
export Version from './version';
export Create from './create';
