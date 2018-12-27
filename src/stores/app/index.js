import { observable, action } from 'mobx';
import _, { get, assign } from 'lodash';

import { getFormData, getProgress } from 'utils';
import ts from 'config/translation';
import { t } from 'i18next';

import Store from '../Store';

const defaultStatus = ['draft', 'active', 'suspended'];
const maxsize = 2 * 1024 * 1024;
let sequence = 0; // app screenshot for sort

export default class AppStore extends Store {
  @observable apps = [];

  @observable homeApps = [];

  // store page category apps
  @observable storeApps = [];

  // normal user store page app total
  @observable storeTotal = 0;

  // menu apps
  @observable menuApps = [];

  // judje query menu apps
  @observable hasMeunApps = false;

  @observable
  appDetail = {
    name: '',
    abstraction: '',
    description: '',
    category_id: '',
    home: '',
    readme: '',
    tos: '',
    icon: '',
    screenshots: []
  };

  @observable summaryInfo = {};

  // replace original statistic
  @observable categoryTitle = '';

  @observable appId = '';

  // current app_id
  @observable isLoading = false;

  @observable isProgressive = false;

  @observable totalCount = 0;

  @observable appCount = 0;

  @observable currentPage = 1;

  // app table query params
  @observable searchWord = '';

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

  @observable detailTab = '';

  @observable currentPic = 1;

  @observable viewType = 'list';

  @observable createStep = 1;

  @observable createReopId = '';

  @observable uploadFile = '';

  @observable createError = '';

  @observable createResult = null;

  @observable hasMore = false;

  isEdit = true;

  resetAppDetail = {};

  @observable iconShow = '';

  @observable screenshotsShow = '';

  // menu actions logic
  @observable
  handleApp = {
    action: '', // delete, modify
    selectedCategory: '' // category id
  };

  @action
  fetchMenuApps = async () => {
    const params = {
      sort_key: 'status_time',
      limit: 5,
      status: defaultStatus
    };
    const result = await this.request.get('apps', params);
    this.menuApps = get(result, 'app_set', []);
    this.hasMeunApps = true;
  };

  @action
  fetchActiveApps = async (params = {}) => {
    const defaultParams = {
      sort_key: 'status_time',
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize
    };

    if (params.noLimit) {
      defaultParams.limit = this.maxLimit;
      defaultParams.offset = 0;
      delete params.noLimit;
    }

    if (this.searchWord) {
      defaultParams.search_word = this.searchWord;
    }

    this.isLoading = true;
    const result = await this.request.get(
      'active_apps',
      assign(defaultParams, params)
    );
    this.isLoading = false;

    this.apps = get(result, 'app_set', []);
    this.totalCount = get(result, 'total_count', 0);
  };

  @action
  fetchAll = async (params = {}) => {
    const defaultParams = {
      sort_key: 'status_time',
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
      status: this.selectStatus ? this.selectStatus : defaultStatus
    };

    if (params.noLimit) {
      defaultParams.limit = this.maxLimit;
      defaultParams.offset = 0;
      delete params.noLimit;
    }
    if (params.app_id) {
      delete defaultParams.status;
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
      defaultParams.owner = this.userId;
    }

    if (!params.noLoading) {
      this.isLoading = true;
    } else {
      this.isProgressive = true;
      delete params.noLoading;
    }

    const result = await this.request.get(
      'apps',
      assign(defaultParams, params)
    );

    const apps = get(result, 'app_set', []);
    if (params.loadMore) {
      this.apps = _.concat(this.apps.slice(), apps);
    } else {
      this.apps = apps;
    }

    this.totalCount = get(result, 'total_count', 0);

    // appCount for show repo datail page "App Count"
    if (!this.searchWord && !this.selectStatus) {
      this.appCount = this.totalCount;
    }

    this.isLoading = false;
    this.isProgressive = false;
    this.hasMore = this.totalCount > (this.currentPage + 1) * this.pageSize;
  };

  @action
  fetchStatistics = async () => {
    // this.isLoading = true;
    const result = await this.request.get('apps/statistics');
    this.summaryInfo = {
      name: 'Apps',
      iconName: 'appcenter',
      centerName: 'Repos',
      total: get(result, 'app_count', 0),
      progressTotal: get(result, 'repo_count', 0),
      progress: get(result, 'top_ten_repos', {}),
      histograms: get(result, 'last_two_week_created', {}),
      topRepos: getProgress(get(result, 'top_ten_repos', {})), // top repos
      appCount: get(result, 'app_count', 0),
      repoCount: get(result, 'repo_count', 0)
    };
    // this.isLoading = false;
  };

  @action
  fetch = async (appId = '') => {
    this.isLoading = true;
    const result = await this.request.get(`apps`, {
      app_id: appId,
      isGlobalQuery: true
    });
    const appDetail = get(result, 'app_set[0]', {});
    this.appDetail = _.assign(appDetail, {
      category_id: get(appDetail, 'category_set[0].category_id', '')
    });
    // set this variable for reset app info
    this.resetAppDetail = { ...this.appDetail };
    this.isLoading = false;
  };

  @action
  createOrModify = async (params = {}) => {
    const defaultParams = {
      repo_id: this.createReopId,
      package: this.uploadFile
    };

    if (this.createAppId) {
      defaultParams.app_id = this.createAppId;
      await this.modify(assign(defaultParams, params));
    } else {
      defaultParams.status = 'draft';
      await this.create(assign(defaultParams, params));
    }

    if (get(this.createResult, 'app_id')) {
      this.createAppId = get(this.createResult, 'app_id');
      this.createStep = 3; // show application has been created page
      await this.fetchMenuApps();
    } else {
      const { err, errDetail } = this.createResult;
      this.createError = errDetail || err;
    }
  };

  @action
  create = async (params = {}) => {
    this.isLoading = true;
    this.createResult = await this.request.post('apps', params);
    this.isLoading = false;
  };

  @action
  modify = async (params = {}, hasNote) => {
    this.isLoading = true;
    this.createResult = await this.request.patch('apps', params);
    this.isLoading = false;

    if (hasNote && get(this.createResult, 'app_id')) {
      this.info('应用信息保存成功');
    }
  };

  @action
  modifyApp = async e => {
    if (e) {
      e.preventDefault();
    }

    const data = _.pick(this.appDetail, [
      'name',
      'abstraction',
      'description',
      'home',
      'icon'
    ]);

    await this.modify(
      _.assign(
        data,
        {
          app_id: this.appDetail.app_id,
          category_id: this.appDetail.category_id,
          icon: this.appDetail.icon
        },
        Boolean(e)
      )
    );
  };

  @action
  changeApp = (event, type) => {
    this.appDetail[type] = event.target.value;
  };

  @action
  changeCategory = value => {
    this.appDetail.category_id = value;
  };

  @action
  saveAppInfo = async type => {
    await this.modify(
      {
        app_id: this.appDetail.app_id,
        [type]: this.appDetail[type]
      },
      true
    );
  };

  @action
  attachment = async (params = {}) => {
    await this.request.patch('app/attachment', params);
  };

  @action
  checkIcon = file => {
    if (!/\.(png)$/.test(file.name.toLocaleLowerCase())) {
      this.error(t('icon_format_note'));
      return false;
    }

    if (file.size > maxsize) {
      this.error(t('The file size cannot exceed 2M'));
      return false;
    }

    return true;
  };

  @action
  uploadIcon = async (base64Str, file) => {
    const result = await this.attachment({
      app_id: this.appDetail.app_id,
      type: 'icon',
      attachment_content: base64Str
    });

    if (result && result.errDetail) {
      return false;
    }

    this.appDetail.icon = base64Str;
  };

  @action
  deleteIcon = () => {
    this.appDetail.icon = '';
  };

  @action
  checkScreenshot = file => {
    if (!/\.(png|jpg)$/.test(file.name.toLocaleLowerCase())) {
      this.error(t('screenshot_format_note'));
      return false;
    }

    if (file.size > maxsize) {
      this.error(t('The file size cannot exceed 2M'));
      return false;
    }

    return true;
  };

  @action
  uploadScreenshot = async (base64Str, file) => {
    const { screenshots } = this.appDetail;
    const len = _.isArray(screenshots) ? screenshots.length : 0;
    if (len >= 6) {
      return this.error(t('最多只能上传6张界面截图'));
    }

    const result = await this.attachment({
      app_id: this.appDetail.app_id,
      type: 'screenshot',
      attachment_content: base64Str,
      sequence
    });

    if (result && result.errDetail) {
      return false;
    }

    sequence++;
    if (_.isArray(screenshots)) {
      this.appDetail.screenshots.push(base64Str);
    } else {
      this.appDetail.screenshots = [base64Str];
    }
  };

  @action
  deleteScreenshot = () => {
    this.appDetail.screenshots = [];
  };

  @action
  remove = async () => {
    this.appId = this.appId ? this.appId : this.appDetail.app_id;
    const ids = this.operateType === 'multiple' ? this.appIds.toJSON() : [this.appId];
    const result = await this.request.delete('apps', { app_id: ids });

    if (get(result, 'app_id')) {
      await this.fetchMenuApps();
      if (this.operateType !== 'detailDelete') {
        await this.fetchAll();
        this.cancelSelected();
        this.hideModal();
      }
      this.success(ts('Delete app successfully.'));
    } else {
      return result;
    }
  };

  @action
  changeAppCate = value => {
    this.handleApp.selectedCategory = value;
  };

  @action
  modifyCategoryById = async () => {
    if (!this.handleApp.selectedCategory) {
      this.info(ts('Please select a category'));
      return;
    }
    const result = await this.modify({
      category_id: this.handleApp.selectedCategory,
      app_id: this.appId
    });
    this.hideModal();

    if (!result.err) {
      this.success(ts('Modify category successfully'));
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
    const availableCate = category_set.find(
      cate => cate.category_id && cate.status === 'enabled'
    );
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

  reset = () => {
    this.currentPage = 1;
    this.selectStatus = '';
    this.searchWord = '';
    this.categoryId = '';
    this.repoId = '';
    this.userId = '';

    this.selectedRowKeys = [];
    this.appIds = [];

    this.apps = [];
    this.appDetail = {};
  };

  @action
  loadMore = async page => {
    this.currentPage = page;
    await this.fetchAll({ loadMore: true });
  };

  @action
  loadMoreHomeApps = async page => {
    this.currentPage = page;
    await this.fetchAll({ loadMore: true });
    this.homeApps = this.apps.slice();
  };

  createReset = () => {
    this.createStep = 1;
    this.createReopId = '';
    this.uploadFile = '';
    this.createError = '';
    this.createAppId = '';
    this.createResult = null;
  };

  @action
  resetBaseInfo = () => {
    _.assign(this.appDetail, this.resetAppDetail);
  };

  @action
  setCreateStep = step => {
    this.createStep = step;
  };
}

export Deploy from './deploy';
export Version from './version';
export Create from './create';
