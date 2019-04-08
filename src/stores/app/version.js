import { action } from 'mobx';
import _, { get, assign, assignIn } from 'lodash';
import { Base64 } from 'js-base64';
import { downloadFileFromBase64 } from 'utils';

import { useTableActions } from 'mixins';
import { getReviewType, getFilterStatus } from 'config/version';
import { formCheck, fieldCheck } from 'config/form-check';
import ACTION from 'config/action-id';

import Store from '../Store';

const maxSize = 2 * 1024 * 1024;

@useTableActions
export default class AppVersionStore extends Store {
  constructor(...args) {
    super(...args);
    this.defaultStatus = [
      'draft',
      'submitted',
      'in-review',
      'passed',
      'rejected',
      'active',
      'suspended'
    ];
    this.steps = 3;

    this.defineObservables(function () {
      this.versions = [];

      this.reviews = [];

      this.version = {
        name: '',
        description: ''
      };

      this.isLoading = false;

      this.isModalOpen = false;

      this.isDialogOpen = false;

      this.isTipsOpen = false;

      this.dialogType = '';

      // delete, show_all
      this.readme = '';

      this.appId = '';

      this.name = '';

      this.packageName = '';

      this.description = '';

      this.currentVersion = {};

      this.uploadFile = '';

      this.createStep = 1;

      this.createError = '';

      this.uploadError = {};

      this.createResult = null;

      this.activeType = 'unprocessed';

      this.reason = ''; // version reject reason

      this.store = {};

      this.audits = {}; // define object for not repeat query of the same version

      this.auditRecord = [];

      this.currentAuditPage = 1;

      this.totalAuditCount = 0;

      this.typeVersions = [];

      this.reviewDetail = {};

      this.isSubmitCheck = false;

      this.activeStep = 1;

      this.disableNextStep = false;

      this.checkResult = {};

      this.reveiwTypes = [];
    });
  }

  get appStore() {
    return this.getStore('app');
  }

  get userStore() {
    return this.getStore('user');
  }

  get roleStore() {
    return this.getStore('role');
  }

  get vendorStore() {
    return this.getStore('vendor');
  }

  get describeVersionName() {
    return this.getUser().isUserPortal ? 'active_app_versions' : 'app_versions';
  }

  @action
  fetchAll = async (params = {}) => {
    params = this.normalizeParams(params);

    if (params.noLimit) {
      params.limit = this.maxLimit;
      params.offset = 0;
      delete params.noLimit;
    }

    if (this.searchWord) {
      params.search_word = this.searchWord;
    }
    if (this.appId) {
      params.app_id = this.appId;
    }

    this.isLoading = true;
    const result = await this.request.get(this.describeVersionName, params);
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

    this.isLoading = false;
  };

  @action
  fetch = async (versionId = '') => {
    this.isLoading = true;
    const result = await this.request.get(this.describeVersionName, {
      version_id: versionId
    });
    this.version = get(result, 'app_version_set[0]', {});
    this.isLoading = false;
  };

  @action
  setReviewTypes = async () => {
    const hasISVReview = this.roleStore.checkAction(ACTION.ISVReview);
    const hasBussinessReview = this.roleStore.checkAction(
      ACTION.BusinessReview
    );
    const hasDevelopReview = this.roleStore.checkAction(ACTION.TechnicalReview);

    this.reveiwTypes = [];
    if (hasISVReview) {
      this.reveiwTypes.push('isv');
    }
    if (hasBussinessReview) {
      this.reveiwTypes.push('business');
    }
    if (hasDevelopReview) {
      this.reveiwTypes.push('technical');
    }
  };

  @action
  fetchReviews = async (params = {}) => {
    const status = getFilterStatus(this.activeType, this.reveiwTypes);

    const defaultParams = {
      status: this.selectStatus ? this.selectStatus : status,
      sort_key: 'status_time',
      limit: this.pageSize,
      reverse: false,
      offset: (this.currentPage - 1) * this.pageSize
    };

    if (params.noLimit) {
      defaultParams.limit = this.maxLimit;
      defaultParams.offset = 0;
      delete params.noLimit;
    }

    this.isLoading = true;
    const result = await this.request.get(
      'app_version_reviews',
      assign(defaultParams, params)
    );

    this.reviews = get(result, 'app_version_review_set', []);
    this.totalCount = get(result, 'total_count', 0);

    this.isLoading = false;

    // query app review table relative data
    const appIds = this.reviews.map(item => item.app_id);
    if (appIds.length > 0) {
      const appStore = this.appStore;
      await appStore.fetchAll({ app_id: _.uniq(appIds) });
    }

    const userIds = this.reviews.map(item => _.get(item, 'phase.developer.operator'));
    const reviewers = this.reviews.map(item => item.reviewer);
    if (userIds.length > 0) {
      await this.userStore.fetchAll({
        user_id: _.uniq(_.concat(userIds, reviewers))
      });
    }
  };

  @action
  changeReviewPagination = async page => {
    this.currentPage = page;
    await this.fetchReviews();
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

  // handleType value is: submit、release、suspend、recover、delete
  @action
  handle = async (handleType, versionId) => {
    this.isLoading = true;

    const result = await this.request.post(`app_version/action/${handleType}`, {
      version_id: versionId
    });

    if (get(result, 'version_id')) {
      this.hideModal();
      // this.success(`${capitalize(handleType)} this version successfully`);
      await this.fetch(versionId);

      if (handleType === 'release') {
        this.showTypeDialog('release');
      }
    } else {
      return result;
    }

    this.isLoading = false;
  };

  /**
   *
   * @param handleType: review, pass, reject
   * @param versionId
   * @returns {Promise<*>}
   */
  @action
  versionReview = async (params = {}) => {
    const {
      handleType, versionId, currentStatus, noTips
    } = params;

    if (handleType === 'reject' && !this.reason) {
      return this.error('Please input the reason for reject');
    }

    const data = { version_id: versionId };
    if (handleType === 'reject') {
      data.message = this.reason;
    }

    this.isLoading = true;
    const reviewType = getReviewType(currentStatus);
    const result = await this.request.post(
      `app_version/action/${handleType}/${reviewType}`,
      data
    );

    if (get(result, 'version_id')) {
      if (!noTips) {
        this.hideModal();
        await this.fetch(versionId);
        await this.fetchReviewDetail(this.reviewDetail.review_id);
      }

      if (handleType === 'review') {
        this.isTipsOpen = !noTips;
      } else if (handleType === 'reject') {
        this.success(`${reviewType.toUpperCase()}_REJECT_PASS`);
      } else {
        this.success(`${reviewType.toUpperCase()}_REVIEW_PASS`);
      }
    } else {
      return result;
    }

    this.isLoading = false;
  };

  // type value is: suspend、recover
  @action
  versionSuspend = async (versionIds, type) => {
    let isOperateSuccess = true;

    for (let i = 0; i < versionIds.length; i++) {
      const result = await this.request.post(`app_version/action/${type}`, {
        version_id: versionIds[i]
      });

      if (!get(result, 'version_id')) {
        isOperateSuccess = false;
      }
    }

    if (isOperateSuccess) {
      this.appStore.hideModal();
      const appId = _.get(this.appStore, 'appDetail.app_id', '');
      await this.fetchAll({
        app_id: _.get(this.appStore, 'appDetail.app_id', ''),
        status: ['active', 'suspended'],
        noLimit: true
      });
      await this.appStore.fetch(appId);
      this.success(`${_.capitalize(type)} successfully`);
    }
  };

  @action
  fetchAudits = async (params = {}) => {
    this.isLoading = true;
    const defaultParams = {
      limit: this.pageSize,
      offset: (this.currentAuditPage - 1) * this.pageSize
    };

    if (params.noLimit) {
      defaultParams.limit = this.maxLimit;
      defaultParams.offset = 0;
      delete params.noLimit;
    }

    const result = await this.request.get(
      'app_version_audits',
      _.extend(defaultParams, params)
    );

    const audits = get(result, 'app_version_audit_set', []);
    assignIn(this.audits, { [params.version_id]: audits });

    this.auditRecord = audits;
    this.totalAuditCount = get(result, 'total_count', 0);

    // judge need query users again
    const oldUserIds = this.userStore.users.map(item => item.user_id).sort();
    const userIds = audits.map(item => item.operator);
    const newUserIds = _.uniq(_.concat(oldUserIds, userIds)).sort();
    if (!_.isEqual(oldUserIds, newUserIds)) {
      await this.userStore.fetchAll({
        user_id: newUserIds,
        noLimit: true
      });
    }

    this.isLoading = false;
  };

  @action
  changeAuditPagination = async page => {
    this.currentAuditPage = page;
    await this.fetchAudits({
      app_id: this.appId,
      version_id: this.versionId
    });
  };

  @action
  fetchReviewDetail = async (reviewId = '') => {
    this.isLoading = true;
    const result = await this.request.get('app_version_reviews', {
      review_id: reviewId
    });

    this.reviewDetail = _.get(result, 'app_version_review_set[0]', {});
    const { phase } = this.reviewDetail;
    const userIds = _.uniq(_.map(phase, o => o.operator));
    await this.userStore.fetchAll({ user_id: userIds });
    this.isLoading = false;
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
  handleCreateVersion = async appId => {
    if (!this.name) {
      this.info('Please input Name!');
    } else if (!/https?:\/\/.+/.test(this.packageName)) {
      this.info('Package url is empty or invalid!');
    } else {
      const data = {
        app_id: appId,
        name: this.name,
        package_name: this.packageName,
        description: this.description
      };
      const result = await this.create(data);

      if (!result.err) {
        this.success('Create App Version successful');
        this.hideModal();
        await this.fetchAll({ app_id: appId });
      }
    }
  };

  @action
  fetchPackageFiles = async versionId => {
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
  };

  @action
  downloadPackage = async (versionId, pkgName) => {
    const result = await this.request.get('app_version/package', {
      version_id: versionId
    });
    this.uploadFile = result.package;

    downloadFileFromBase64(this.uploadFile, pkgName);
  };

  @action
  fetchTypeVersions = async appId => {
    this.isLoading = true;

    const data = this.normalizeParams({
      noLimit: true,
      app_id: appId
    });

    if (this.getUser().isUserPortal) {
      data.status = ['active'];
    }
    const result = await this.request.get(this.describeVersionName, data);
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
      this.createError = 'file_format_note';
      return false;
    }
    if (file.size > maxSize) {
      this.createError = 'The file size cannot exceed 2M';
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
      this.createError = 'Upload_Package_Error';
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

  @action
  changeReason = event => {
    this.reason = event.target.value;
  };

  @action
  changeSubmitCheck = () => {
    this.isSubmitCheck = !this.isSubmitCheck;

    if (this.isSubmitCheck) {
      this.hideModal();
    } else {
      this.activeStep = 1;
    }
  };

  @action
  changeVersion = (event, type) => {
    this.version[type] = event.target.value;
  };

  @action
  checkVersion = async (event, field, isFocus) => {
    if (isFocus) {
      this.checkResult = _.assign(this.checkResult, { [field]: '' });
    } else {
      this.checkResult = _.assign(
        this.checkResult,
        fieldCheck('version', field, event.target.value)
      );
    }
  };

  @action
  goBack = () => {
    this.isSubmitCheck = false;
    this.activeStep = 1;
  };

  @action
  prevStep = () => {
    this.errorMessage = '';
    this.disableNextStep = false;
    if (this.activeStep > 1) {
      this.activeStep = this.activeStep - 1;
    }
  };

  @action
  nextStep = async () => {
    let isActionSuccess = false;

    if (this.activeStep === 1) {
      isActionSuccess = !this.appStore.isEdit || (await this.appStore.modifyApp());
    } else if (this.activeStep === 2) {
      const data = _.pick(this.version, ['version_id', 'name', 'description']);

      this.checkResult = _.assign({}, formCheck('version', data));

      if (_.isEmpty(this.checkResult)) {
        await this.modify(data);

        // get data for app detail page
        const { appDetail, fetchActiveApps } = this.appStore;
        await this.fetchTypeVersions(appDetail.app_id);
        await fetchActiveApps();

        isActionSuccess = true;
      }
    } else if (this.activeStep === 3) {
      const result = await this.handle('submit', this.version.version_id);
      isActionSuccess = !(result && result.err);

      // for refresh the version submit record
      if (isActionSuccess) {
        await this.fetchAudits({
          app_id: this.version.app_id,
          version_id: this.version.version_id
        });
      }
    }

    if (isActionSuccess) {
      this.activeStep++;
    }
  };
}
