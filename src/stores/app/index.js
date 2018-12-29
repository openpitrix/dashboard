import { observable, action } from 'mobx';
import _, { get, assign } from 'lodash';
import { getProgress, getCookie } from 'utils';
import ts from 'config/translation';
import { t } from 'i18next';

import { useTableActions } from 'mixins';
import Store from '../Store';

const defaultStatus = ['draft', 'active', 'suspended'];
const maxsize = 2 * 1024 * 1024;
let sequence = 0; // app screenshot for sort

@useTableActions
class AppStore extends Store {
  sortKey = 'status_time';

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

  @observable appCount = 0;

  @observable repoId = '';

  @observable categoryId = '';

  @observable userId = '';

  @observable isModalOpen = false;

  @observable isDeleteOpen = false;

  @observable operateType = '';

  @observable appTitle = '';

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

  @observable unCategoriedApps = [];

  @action
  fetchMenuApps = async () => {
    const userId = getCookie('user_id');
    const menuApps = localStorage.getItem(`${userId}-apps`);

    if (!menuApps) {
      const params = {
        sort_key: 'status_time',
        limit: 5,
        status: defaultStatus
      };
      const result = await this.request.get('apps', params);

      this.menuApps = get(result, 'app_set', []);
      localStorage.setItem(`${userId}-apps`, JSON.stringify(this.menuApps));
    } else {
      this.menuApps = JSON.parse(menuApps);
    }
  };

  @action
  fetchMeunApp = async (appId, isFetch) => {
    const userId = getCookie('user_id');
    const menuApps = localStorage.getItem(`${userId}-apps`);
    const apps = JSON.parse(menuApps || '[]');
    const appDetail = _.find(apps, { app_id: appId });

    if (appDetail && !isFetch) {
      this.appDetail = appDetail;
      // modify info will change app info
      this.resetAppDetail = appDetail;
    } else {
      await this.fetch(appId);

      if (appDetail) {
        const index = _.findIndex(apps, { app_id: appId });
        apps.splice(index, 1, this.appDetail);
      } else {
        apps.unshift(this.appDetail);
        apps.splice(5, 1);
      }

      localStorage.setItem(`${userId}-apps`, JSON.stringify(apps));
      this.menuApps = apps;
    }
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
    // dont mutate observables, just return results
    const noMutate = Boolean(params.noMutate);

    params = this.normalizeParams(_.omit(params, ['noMutate']));

    if (params.app_id) {
      delete params.status;
    }

    if (this.searchWord) {
      params.search_word = this.searchWord;
    }

    if (this.categoryId && !params.category_id) {
      params.category_id = this.categoryId;
    }

    if (this.repoId) {
      params.repo_id = this.repoId;
    }
    if (this.userId) {
      params.owner = this.userId;
    }

    if (!params.noLoading) {
      this.isLoading = true;
    } else {
      this.isProgressive = true;
      delete params.noLoading;
    }

    const result = await this.request.get('apps', params);
    const apps = get(result, 'app_set', []);
    const totalCount = get(result, 'total_count', 0);

    if (noMutate) {
      return {
        apps,
        totalCount
      };
    }

    if (params.loadMore) {
      this.apps = _.concat(this.apps.slice(), apps);
    } else {
      this.apps = apps;
    }

    this.totalCount = totalCount;

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
    this.isLoading = true;
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
    this.isLoading = false;
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
  };

  @action
  modifyApp = async event => {
    if (event) {
      event.preventDefault();
    }

    const data = _.pick(this.appDetail, [
      'name',
      'abstraction',
      'description',
      'home',
      'icon'
    ]);

    await this.modify(
      _.assign(data, {
        app_id: this.appDetail.app_id,
        category_id: this.appDetail.category_id,
        icon: this.appDetail.icon
      }),
      Boolean(event)
    );

    // update the meun app show
    if (get(this.createResult, 'app_id')) {
      this.fetchMeunApp(this.appDetail.app_id, true);
    }
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

    if (result && result.err) {
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
    const ids = this.operateType === 'multiple' ? this.selectIds.toJSON() : [this.appId];

    const result = await this.request.delete('apps', { app_id: ids });

    if (get(result, 'app_id')) {
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
  showDeleteApp = ids => {
    if (typeof ids === 'string') {
      this.appId = ids;
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

  reset = () => {
    this.currentPage = 1;
    this.selectStatus = '';
    this.searchWord = '';
    this.categoryId = '';
    this.repoId = '';
    this.userId = '';

    // this.cancelSelected();

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

  @action
  resetBaseInfo = () => {
    _.assign(this.appDetail, this.resetAppDetail);
  };

  @action
  setCreateStep = step => {
    this.createStep = step;
  };
}

export default AppStore;

export Deploy from './deploy';
export Version from './version';
export Create from './create';
export Uncategoried from './uncategoried';
