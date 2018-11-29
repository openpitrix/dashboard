import { observable, action } from 'mobx';

import _ from 'lodash';
import { t } from 'i18next';

import Store from '../Store';

const versionTypes = [
  {
    icon: 'vm-icon',
    name: 'VM',
    value: 'vmbase',
    intro: 'delivery_type_intro_vm',
    introLink: ''
  },
  {
    icon: 'helm-icon',
    name: 'Helm',
    value: 'helm',
    intro: 'delivery_type_intro_helm',
    introLink: ''
  },
  {
    icon: 'saas-icon',
    name: 'SaaS',
    value: 'saas',
    intro: 'delivery_type_intro_saas',
    introLink: ''
  },
  {
    icon: 'api-icon',
    name: 'API',
    value: 'api',
    intro: 'delivery_type_intro_api',
    introLink: ''
  },
  {
    icon: 'native-icon',
    name: 'Native',
    value: 'native',
    intro: 'delivery_type_intro_native',
    introLink: ''
  },
  {
    icon: 'serveless-icon',
    name: 'Serveless',
    value: 'serveless',
    intro: 'delivery_type_intro_serveless',
    introLink: ''
  }
];

export default class AppCreateStore extends Store {
  @observable activeStep = 1;

  steps = 3;

  @observable isLoading = false;

  @observable pageLoading = false;

  @observable disableNextStep = true;

  @observable uploadStatus = 'init';

  @observable errorMessage = '';

  @observable versionTypes = versionTypes;

  @observable
  attribute = {
    name: '',
    version_name: '',
    version_type: null,
    versino_package: null,
    icon: ''
  };

  @observable iconBase64 = '';

  @observable fileName = '';

  @observable appDetail = {};

  @action
  nextStep = async () => {
    // window.scroll({ top: 0, behavior: 'smooth' });
    if (this.errorMessage) {
      return false;
    }
    if (!_.get(this.attribute, 'version_type')) {
      return this.info(t('Please select a delivery type!'));
    }
    if (this.activeStep === 3) {
      await this.create();
      const { app_id } = this.createResult;
      if (!app_id) {
        return false;
      }

      await this.fetchOneApp({ app_id });
      // await this.modify();
    }
    this.disableNextStep = true;
    this.errorMessage = '';
    this.activeStep = this.activeStep + 1;
  };

  @action
  prevStep = () => {
    this.errorMessage = '';
    this.disableNextStep = false;
    if (this.activeStep > 1) {
      this.activeStep = this.activeStep - 1;
    }
  };

  // TODO
  checkAddedDelivery = name => this.versionTypes.toJSON().includes(name);

  reset = () => {
    this.activeStep = 1;
    this.attribute = {
      name: '',
      version_name: '',
      version_type: null,
      versino_package: null,
      icon: ''
    };
    this.iconBase64 = '';
    this.errorMessage = '';
  };

  @action
  create = async (params = {}) => {
    this.isLoading = true;
    const defaultParams = _.pickBy(
      this.attribute,
      o => o !== null && !_.isUndefined(o) && o !== ''
    );

    this.createResult = await this.request.post(
      'apps',
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
    if (attribute.version_type === type) {
      attribute.version_type = '';
      this.disableNextStep = true;
    } else {
      attribute.version_type = type;
      this.disableNextStep = false;
    }
  };

  @action
  checkPackageFile = file => {
    const maxsize = 2 * 1024 * 1024;
    this.disableNextStep = true;

    if (
      !/\.(tar|tar\.gz|tar\.bz|tgz|zip)$/.test(file.name.toLocaleLowerCase())
    ) {
      this.errorMessage = t('file_format_note');
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
  uploadPackage = (base64Str, file) => {
    this.attribute.version_package = base64Str;
    this.uploadStatus = 'ok';
    this.fileName = file.name;
  };

  @action
  checkIconFile = file => {
    const maxsize = 2 * 1024 * 1024;
    this.disableNextStep = true;

    if (!/\.(png|svg)$/.test(file.name.toLocaleLowerCase())) {
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
  valueChange = (name, value) => {
    this.attribute[name] = value;
    if (this.attribute.name) {
      this.disableNextStep = false;
    } else {
      this.disableNextStep = true;
    }
    this.errorMessage = '';
  };
}
