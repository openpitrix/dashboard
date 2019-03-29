import { action } from 'mobx';

import _ from 'lodash';
import { t } from 'i18next';
import { versionTypes } from 'config/version-types';

import Store from '../Store';

const appModel = {
  name: '',
  version_name: '',
  version_type: '',
  versino_package: null,
  icon: ''
};
const appVersionModel = {
  app_id: '',
  name: '',
  type: '',
  package: null
};

export default class AppCreateStore extends Store {
  constructor(...args) {
    super(...args);

    this.steps = 3;
    this.isCreateApp = true;
    this.isAddVersion = false;
    this.modifyVersionType = '';

    this.defineObservables(function () {
      this.activeStep = 1;

      this.isLoading = false;

      this.pageLoading = false;

      this.disableNextStep = true;

      this.uploadStatus = 'init';

      this.errorMessage = '';

      this.attribute = {};

      this.iconBase64 = '';

      this.fileName = '';

      this.appDetail = {};

      this.uploadError = {};
    });
  }

  get versionTypeName() {
    const type = this.getVersionType();
    const item = _.find(versionTypes, { value: type });
    return _.get(item, 'name', '');
  }

  @action
  nextStep = async () => {
    const { isCreateApp, isAddVersion } = this;
    if (this.disableNextStep) {
      return false;
    }
    if (!this.getVersionType()) {
      return this.info(t('Please select a delivery type!'));
    }
    if (
      (!isCreateApp && this.activeStep === 2)
      || (isCreateApp && this.activeStep === 3)
      || (isAddVersion && this.activeStep === 1)
    ) {
      await this.create();
      if (this.errorMessage) {
        this.uploadStatus = 'init';
        return false;
      }
      let { app_id } = this.createResult;
      if (!app_id && !isCreateApp) {
        app_id = _.get(this.appDetail, 'app_id');
      }

      await this.fetchOneApp({ app_id });
    }
    this.errorMessage = '';
    this.activeStep = this.activeStep + 1;
    if (this.activeStep === 2) {
      this.disableNextStep = true;
    }
  };

  @action
  prevStep = () => {
    this.errorMessage = '';
    this.disableNextStep = false;
    if (this.activeStep > 1) {
      this.activeStep = this.activeStep - 1;
    }
  };

  getVersionType = () => {
    const versionName = this.isCreateApp ? 'version_type' : 'type';
    return this.attribute[versionName] || this.modifyVersionType;
  };

  checkAddedVersionType = name => {
    const versions = _.get(this.appDetail, 'app_version_types', '');
    return versions.split(',').includes(name);
  };

  checkSelectedVersionType = name => this.getVersionType() === name;

  @action
  load = ({ appId, type }) => {
    this.isCreateApp = !appId;
    this.isAddVersion = Boolean(type);
    this.activeStep = 1;

    if (!appId) {
      this.steps = 3;
      this.attribute = _.assign({}, appModel);
    } else {
      this.steps = type ? 1 : 2;
      this.attribute = _.assign({ appId }, appVersionModel);
      this.attribute.type = type;
    }

    this.iconBase64 = '';
    this.errorMessage = '';
    this.uploadStatus = 'init';
    this.disableNextStep = true;
    this.appDetail = {};
  };

  @action
  create = async (params = {}) => {
    this.isLoading = true;
    this.errorMessage = '';
    const defaultParams = _.pickBy(
      this.attribute,
      o => o !== null && !_.isUndefined(o) && o !== ''
    );

    const actionName = this.isCreateApp ? 'apps' : 'app_versions';

    this.createResult = await this.request.post(
      actionName,
      _.assign(defaultParams, params)
    );

    if (_.get(this.createResult, 'app_id')) {
      this.attribute.app_id = _.get(this.createResult, 'app_id');
    } else {
      const { err, errDetail } = this.createResult;
      this.errorMessage = errDetail || err;
    }
    this.isLoading = false;
  };

  fetchOneApp = async (params = {}) => {
    this.isLoading = true;
    const defaultParams = {
      limit: 1
    };
    const result = await this.request.get(
      'apps',
      _.assign(defaultParams, params)
    );
    this.appDetail = _.get(result, 'app_set[0]', {});
    this.isLoading = false;
  };

  @action
  modify = async (params = {}) => {
    this.isLoading = true;
    this.createResult = await this.request.patch('apps', params);
    this.isLoading = false;
  };

  @action
  selectVersionType = type => {
    const { attribute } = this;
    const typeName = this.isCreateApp ? 'version_type' : 'type';
    if (attribute.version_type === type) {
      attribute[typeName] = '';
      this.disableNextStep = true;
    } else {
      attribute[typeName] = type;
      this.disableNextStep = false;
    }
  };

  @action
  checkPackageFile = file => {
    const maxsize = 2 * 1024 * 1024;

    if (
      !/\.(tar|tar\.gz|tar\.bz|tgz|zip)$/.test(file.name.toLocaleLowerCase())
    ) {
      this.errorMessage = t('file_format_note');
      this.uploadStatus = 'error';
      return false;
    }
    if (file.size > maxsize) {
      this.errorMessage = t('The file size cannot exceed 2M');
      this.uploadStatus = 'error';
      return false;
    }

    this.disableNextStep = false;
    this.errorMessage = '';
    return true;
  };

  @action
  uploadPackage = async (base64Str, file) => {
    this.isLoading = true;
    this.uploadStatus = 'init';
    this.uploadError = {};
    this.disableNextStep = true;
    const param = {
      version_type: this.getVersionType(),
      version_package: base64Str
    };
    const result = await this.request.post('apps/validate_package', param);
    this.isLoading = false;

    if (result.error_details) {
      this.uploadStatus = 'error';
      this.errorMessage = t('Upload_Package_Error');
      this.uploadError = result.error_details;
      return;
    }
    if (result.error || result.err) {
      this.errorMessage = result.error || result.errDetail || result.err;
      return;
    }

    if (this.isCreateApp) {
      this.attribute.version_package = base64Str;
      this.attribute.name = result.name;
      this.attribute.version_name = result.version_name;
    } else {
      this.attribute.package = base64Str;
    }

    this.disableNextStep = false;
    this.uploadStatus = 'ok';
    this.fileName = file.name;
  };

  @action
  checkIconFile = file => {
    const maxsize = 2 * 1024 * 1024;
    this.disableNextStep = true;

    if (!/\.(png)$/.test(file.name.toLocaleLowerCase())) {
      this.errorMessage = t('icon_format_note');
      return false;
    }
    if (file.size > maxsize) {
      this.errorMessage = t('The file size cannot exceed 2M');
      return false;
    }

    this.disableNextStep = false;
    this.errorMessage = '';
    return true;
  };

  @action
  uploadIcon = (base64Str, file) => {
    const ext = _.last(file.name.toLocaleLowerCase().split('.'));
    this.attribute.icon = base64Str;
    if (ext === 'svg') {
      this.iconBase64 = `data:image/svg+xml;base64,${base64Str}`;
    } else {
      this.iconBase64 = `data:image/${ext};base64,${base64Str}`;
    }
  };

  @action
  valueChange = event => {
    const { target } = event;
    const { name, value } = target;
    this.attribute[name] = value;
    if (this.attribute.name) {
      this.disableNextStep = false;
    } else {
      this.disableNextStep = true;
    }
    this.errorMessage = '';
  };
}
