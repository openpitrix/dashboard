import { observable, action } from 'mobx';
import Store from '../Store';
import { get, assign } from 'lodash';
import _ from 'lodash';

export default class AppStore extends Store {
  @observable apps = [];
  @observable appDetail = {};
  @observable summaryInfo = {}; // replace original statistic
  @observable categoryTitle = '';
  @observable appId = ''; // current app_id
  @observable isLoading = false;
  @observable totalCount = 0;
  @observable appCount = 0;
  @observable currentPage = 1;
  @observable isModalOpen = false;
  @observable isDeleteOpen = false;
  @observable appTitle = '';
  @observable searchWord = '';
  @observable currentClusterPage = 1;
  @observable swCluster = ''; //search word cluster
  @observable appIds = [];
  @observable selectedRowKeys = [];
  @observable operateType = '';
  @observable selectStatus = '';
  @observable defaultStatus = ['active'];
  @observable deleteResult = {};

  @observable detailTab = '';
  @observable swVersion = '';
  @observable currentVersionPage = 1;

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
    params.limit = 999;

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
    let pageOffset = params.page || this.currentPage;
    let defaultParams = {
      limit: this.pageSize,
      offset: (pageOffset - 1) * this.pageSize,
      sort_key: 'update_time',
      reverse: true
    };

    if (params.noLimit) {
      delete defaultParams.limit;
      delete defaultParams.offset;
      delete params.noLimit;
    }

    if (this.searchWord) {
      params.search_word = this.searchWord;
    }
    if (!params.status) {
      params.status = this.selectStatus ? this.selectStatus : this.defaultStatus;
    }
    if (params.page) {
      delete params.page;
    }

    this.isLoading = true;
    const result = await this.request.get('apps', assign(defaultParams, params));
    this.apps = get(result, 'app_set', []);
    this.totalCount = get(result, 'total_count', 0);
    if (!this.searchWord) {
      this.appCount = this.totalCount;
    }
    this.isLoading = false;
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
    if (_.get(result, 'app_id')) {
      if (this.operateType === 'detailDelete') {
        this.appDetail = {};
        this.deleteResult = result;
        await this.fetch(this.appId);
      } else {
        this.hideModal();
        await this.fetchAll();
        this.cancelSelected();
      }
      this.showMsg('Delete app successfully.', 'success');
    } else {
      let { err, errDetail } = result;
      this.showMsg(errDetail || err);
    }
  };

  @action
  changeAppCate = value => {
    this.handleApp.selectedCategory = value;
  };

  @action
  modifyCategoryById = async () => {
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
    this.apiMsg(result, 'Modify category successfully', this.fetchAll);
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
  showModifyAppCate = app_id => {
    this.appId = app_id;
    this.isModalOpen = true;
  };

  @action
  changeSearchWord = word => {
    this.searchWord = word;
  };

  @action
  setCurrentPage = page => {
    this.currentPage = page;
  };

  @action
  onSearch = async searchWord => {
    this.changeSearchWord(searchWord);
    this.setCurrentPage(1);
    await this.fetchAll();
  };

  @action
  onClearSearch = async () => {
    this.changeSearchWord('');
    this.setCurrentPage(1);
    await this.fetchAll();
  };

  @action
  onRefresh = async () => {
    await this.fetchAll();
  };

  @action
  changePagination = async page => {
    this.setCurrentPage(page);
    await this.fetchAll();
  };

  @action
  changeClusterSearchWord = sw => {
    this.swCluster = sw;
  };

  @action
  setCurrentVersionPage = page => {
    this.currentVersionPage = page;
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
    this.selectedRowKeys = [];
    this.appIds = [];
    this.pageInitMap = {};
  };

  @action
  onChangeStatus = async status => {
    this.selectStatus = this.selectStatus === status ? '' : status;
    await this.fetchAll({ status: this.selectStatus });
  };
}

export Deploy from './deploy';
export Version from './version';
