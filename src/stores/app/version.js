import { observable, action } from 'mobx';
import _, {
  get, assign, capitalize, assignIn
} from 'lodash';
import { Base64 } from 'js-base64';

import ts from 'config/translation';
import Store from '../Store';

const defaultStatus = [
  'draft',
  'submitted',
  'passed',
  'rejected',
  'active',
  'suspended'
];
const reviwStatus = ['submitted', 'passed', 'rejected', 'active', 'suspended'];
const maxSize = 2 * 1024 * 1024;

export default class AppVersionStore extends Store {
  @observable versions = [];

  @observable version = {};

  @observable isLoading = false;

  @observable isModalOpen = false;

  @observable isDialogOpen = false;

  @observable isTipsOpen = false;

  @observable dialogType = '';

  // delete, show_all
  @observable readme = '';

  @observable totalCount = 0;

  @observable currentPage = 1;

  // version table query params
  @observable searchWord = '';

  @observable selectStatus = '';

  @observable appId = '';

  @observable name = '';

  @observable packageName = '';

  @observable description = '';

  @observable currentVersion = {};

  @observable uploadFile = '';

  @observable createStep = 1;

  @observable createError = '';

  @observable uploadError = {};

  @observable createResult = null;

  @observable reason = ''; // version reject reason

  @observable store = {};

  @observable isReview = false; // judge review apps list or app version list

  @observable audits = {}; // define object for not repeat query of the same version

  @observable typeVersions = [];

  @observable reviewDetail = {};

  @action
  fetchAll = async (params = {}) => {
    const status = this.isReview ? reviwStatus : defaultStatus;
    const defaultParams = {
      sort_key: 'create_time',
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
      status: this.selectStatus ? this.selectStatus : status
    };

    if (params.noLimit) {
      defaultParams.limit = this.maxLimit;
      defaultParams.offset = 0;
      delete params.noLimit;
    }

    if (this.searchWord) {
      defaultParams.search_word = this.searchWord;
    }
    if (this.appId) {
      defaultParams.app_id = this.appId;
    }

    this.isLoading = true;
    const result = await this.request.get(
      'app_versions',
      assign(defaultParams, params)
    );
    this.versions = get(result, 'app_version_set', []);
    this.totalCount = get(result, 'total_count', 0);
    const version = this.versions[0];
    if (version && !this.currentVersion.version_id) {
      this.currentVersion = version;
      this.name = version.name;
      this.packageName = version.package_name;
      this.description = version.description;
    } else {
      this.currentVersion = { ...this.currentVersion };
    }

    // todo
    const appStore = this.store.app;
    const appIds = this.versions.map(item => item.app_id);
    if (appStore && appIds.length > 0) {
      appStore.fetchAll({ app_id: appIds });
    }

    // todo
    const userStore = this.store.user;
    const userIds = this.versions.map(item => item.owner);
    if (userStore && userIds.length > 0) {
      userStore.fetchAll({ user_id: userIds });
    }

    this.isLoading = false;
  };

  @action
  fetch = async (versionId = '') => {
    this.isLoading = true;
    const result = await this.request.get(`app_versions`, {
      version_id: versionId
    });
    this.version = get(result, 'app_version_set[0]', {});
    this.isLoading = false;
  };

  @action
  createOrModify = async (params = {}) => {
    const defaultParams = {
      package: this.uploadFile
    };

    const versionId = this.currentVersion.version_id;
    if (versionId) {
      defaultParams.version_id = versionId;
      defaultParams.name = this.name;
      defaultParams.package_name = this.packageName;
      defaultParams.description = this.description;
      if (!this.uploadFile) {
        delete defaultParams.package;
      }
      await this.modify(assign(defaultParams, params));
    } else {
      defaultParams.app_id = this.appId;
      defaultParams.status = 'draft';
      await this.create(assign(defaultParams, params));
    }

    if (get(this.createResult, 'version_id')) {
      if (!versionId) {
        await this.fetchAll();
        this.createStep = 2; // show application has been created page
      }
      return true;
    }
    const { err, errDetail } = this.createResult;
    this.createError = errDetail || err;
    return false;
  };

  @action
  create = async (params = {}) => {
    this.isLoading = true;
    this.createResult = await this.request.post('app_versions', params);
    this.isLoading = false;
  };

  @action
  modify = async (params = {}) => {
    this.isLoading = true;
    this.createResult = await this.request.patch('app_versions', params);
    this.isLoading = false;
  };

  @action
  remove = async versionId => {
    this.isLoading = true;
    await this.request.delete('app_version/action/delete', {
      version_id: versionId
    });
    this.isLoading = false;
  };

  // handleType value is: submit、reject、pass、release、suspend、recover、delete
  @action
  handle = async (handleType, versionId) => {
    this.isLoading = true;
    const params = { version_id: versionId };
    if (handleType === 'reject') {
      params.message = this.reason;
    }

    const result = await this.request.post(
      `app_version/action/${handleType}`,
      params
    );

    if (get(result, 'version_id')) {
      this.hideModal();
      this.success(ts(`${capitalize(handleType)} this version successfully.`));
      await this.fetch(versionId);
    } else {
      return result;
    }
    this.isLoading = false;
  };

  @action
  fetchAudits = async (appId, versionId) => {
    const result = await this.request.get(
      `app/${appId}/version/${versionId}/audits`
    );
    const audits = get(result, 'app_version_audit_set', []);
    assignIn(this.audits, { [versionId]: audits });
  };

  @action
  fetchReviewDetail = async (appId, versionId) => {
    const result = await this.request.get(
      `app/${appId}/version/${versionId}/reviews`
    );
    this.reviewDetail = get(result, 'app_version_review_set[0]', {});
  };

  // todo
  @action
  showModal = () => {
    this.isModalOpen = true;
  };

  @action
  showDialog = () => {
    this.isDialogOpen = true;
  };

  @action
  showTipsOpen = () => {
    this.isTipsOpen = true;
  };

  @action
  hideModal = () => {
    this.isModalOpen = false;
    this.isDialogOpen = false;
    this.isTipsOpen = false;
  };

  setDialogType(type) {
    this.dialogType = type;
  }

  @action
  showCreateVersion = () => {
    this.showModal();
  };

  @action
  showDelete = type => {
    this.setDialogType(type);
    this.showDialog();
  };

  @action
  showTypeDialog = type => {
    this.setDialogType(type);
    this.showDialog();
  };

  @action
  changeName = event => {
    this.name = event.target.value;
  };

  @action
  changePackage = event => {
    this.packageName = event.target.value;
  };

  @action
  changeDescription = event => {
    this.description = event.target.value;
  };

  @action
  async handleCreateVersion(appId) {
    if (!this.name) {
      this.info(ts('Please input Name!'));
    } else if (!/https?:\/\/.+/.test(this.packageName)) {
      this.info(ts('Package url is empty or invalid!'));
    } else {
      const data = {
        app_id: appId,
        name: this.name,
        package_name: this.packageName,
        description: this.description
      };
      const result = await this.create(data);

      if (!result.err) {
        this.success(ts('Create App Version successful.'));
        this.hideModal();
        await this.fetchAll({ app_id: appId });
      }
    }
  }

  @action
  async fetchPackageFiles(versionId) {
    const result = await this.request.get(`app_version/package/files`, {
      version_id: versionId,
      files: ['README.md']
    });
    const files = get(result, 'files', {});
    if (files['README.md']) {
      this.readme = Base64.decode(files['README.md']);
    } else {
      this.readme = '';
    }
  }

  @action
  async fetchActiveVersions(params = {}) {
    const defaultParams = {
      limit: this.maxLimit
    };

    this.isLoading = true;
    const result = await this.request.get(
      'active_app_versions',
      assign(defaultParams, params)
    );
    this.versions = get(result, 'app_version_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  }

  @action
  fetchTypeVersions = async appId => {
    this.isLoading = true;
    const result = await this.request.get('app_versions', {
      limit: this.maxLimit,
      app_id: appId
    });
    const versions = get(result, 'app_version_set', []);

    // get all unique version types
    const types = _.uniq(versions.map(item => item.type));
    // get type relatived versions
    this.typeVersions = types.map(type => ({
      type,
      versions: versions.filter(item => item.type === type)
    }));

    this.isLoading = false;
  };

  checkPackageFile = file => {
    const result = true;
    this.createError = '';

    if (!/\.(tar|tar\.gz|tar\.bz|tgz)$/.test(file.name.toLocaleLowerCase())) {
      this.createError = ts('file_format_note');
      return false;
    }
    if (file.size > maxSize) {
      this.createError = ts('The file size cannot exceed 2M');
      return false;
    }

    return result;
  };

  uploadPackage = async (base64Str, file) => {
    this.isLoading = true;
    this.packageName = file.name;

    const result = await this.request.post('apps/validate_package', {
      version_type: this.version.type,
      version_package: base64Str
    });
    this.isLoading = false;

    if (result.error_details) {
      this.uploadStatus = 'error';
      this.createError = ts('Upload_Package_Error');
      this.uploadError = result.error_details;
      return;
    }
    if (result.err) {
      this.createError = result.err;
      return;
    }

    await this.modify({
      version_id: this.version.version_id,
      package: this.base64Str
    });
  };

  onSearch = async word => {
    this.currentPage = 1;
    this.searchWord = word;
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
  changeReason = event => {
    this.reason = event.target.value;
  };

  reset = () => {
    this.currentPage = 1;
    this.selectStatus = '';
    this.searchWord = '';
    this.appId = '';

    this.createError = '';
    this.createResult = null;

    this.uploadFile = '';
    this.store = {};
    this.isReview = false;

    this.versions = [];
    this.currentVersion = {};
    this.packageName = '';
  };

  @action
  registerStore = (name, store) => {
    this.store[name] = store;
  };
}
