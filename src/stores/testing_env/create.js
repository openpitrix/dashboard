import { observable, action } from 'mobx';
import _ from 'lodash';

import { isHelm } from 'utils';
import { getUrlParam } from 'utils/url';
import { regExpNamespace } from 'config/runtimes';
import Store from '../Store';

const STEPS = 2;
const NO_PROVIDER_STEPS = 3;

const defaultStepOption = {
  steps: STEPS,
  stepBase: 1,
  activeStep: 1,
  disableNextStep: true,
  isLoading: false
};

export default class CreateEnvStore extends Store {
  @observable isLoading = false;

  @observable stepOption = { ...defaultStepOption };

  @observable runtimeUrl = '';

  @observable accessKey = '';

  @observable secretKey = '';

  @observable helmCredential = '';

  @observable credentialName = '';

  @observable credentialDesc = '';

  @observable validatePassed = false;

  @observable validateMsg = '';

  // create runtime, provide runtime info
  @observable
  runtimeInfo = {
    selectZone: '',
    name: '',
    desc: ''
  };

  // last created runtime
  @observable runtime = {};

  @observable selectCredentialId = '';

  @observable showNewlyCreate = false; // show create form if have credentials

  // flags
  @observable doneCreateRt = false;

  @observable doneCreateCredential = false;

  @observable helmNamespace = '';

  get envStore() {
    return this.getStore('testingEnv');
  }

  get credentialStore() {
    return this.getStore('runtimeCredential');
  }

  get isCredential() {
    return getUrlParam('type') === 'credential';
  }

  // fix get platform wrong when refresh page
  get platform() {
    return getUrlParam('provider') || this.envStore.platform;
  }

  get createRuntimeAction() {
    return this.getUser().isUserPortal ? 'runtimes' : 'debug_runtimes';
  }

  getCredentialContent() {
    return JSON.stringify({
      access_key_id: this.accessKey,
      secret_access_key: this.secretKey
    });
  }

  getCredentialParams() {
    return {
      runtime_url: this.runtimeUrl,
      runtime_credential_content: isHelm(this.platform)
        ? this.helmCredential
        : this.getCredentialContent(),
      provider: this.platform,
      // using random string for credential name when type is helm
      name: isHelm(this.platform) ? `rtc-${Date.now()}` : this.credentialName,
      description: ''
    };
  }

  @action
  initSteps = hasProvider => {
    if (hasProvider) {
      _.assign(this.stepOption, {
        steps: STEPS,
        activeStep: 1,
        stepBase: 1
      });
    } else {
      _.assign(this.stepOption, {
        steps: NO_PROVIDER_STEPS,
        activeStep: 0,
        stepBase: 0
      });
    }
  };

  @action
  toggleNewlyCreate = () => {
    if (!this.showNewlyCreate) {
      this.selectCredentialId = '';
      this.setValidateMsg();
    }
    this.showNewlyCreate = !this.showNewlyCreate;
  };

  @action
  prevStep = () => {
    if (this.stepOption.activeStep > this.stepOption.stepBase) {
      this.stepOption.activeStep--;
    }
  };

  @action
  nextStep = async () => {
    const { activeStep, steps } = this.stepOption;
    if (steps === NO_PROVIDER_STEPS && activeStep === 0) {
      this.credentialStore.credentials = [];
      await this.envStore.checkStoreWhenInitPage([this.platform]);
      this.stepOption.activeStep++;
      return;
    }

    if (activeStep < STEPS) {
      if (this.selectCredentialId) {
        // todo
      } else {
        // newly create
        if (!this.validatePassed) {
          return this.error('Please validate runtime credential');
        }

        if (isHelm(this.platform)) {
          // todo
        } else {
          if (!this.isCredential && !this.credentialName) {
            return this.error('Auth info name is empty');
          }
        }

        await this.saveCredential();
      }

      this.stepOption.activeStep++;
    } else {
      await this.doneStep();
    }
  };

  saveCredential = async () => {
    const { runtime_credential_id } = this.credentialStore.credential;
    if (!runtime_credential_id) {
      return await this.credentialStore.create(this.getCredentialParams());
    }
    // modify exist credential
    return await this.credentialStore.modify(
      _.extend(
        _.omit(this.getCredentialParams(), ['runtime_url', 'provider']),
        { runtime_credential_id }
      )
    );
  };

  @action
  doneStep = async () => {
    const { selectZone, name, desc } = this.runtimeInfo;
    const { runtime_credential_id } = this.credentialStore.credential;

    if (this.isCredential) {
      if (!this.credentialName) {
        return this.error('Credential name is empty');
      }

      // create runtime credential
      const res = await this.saveCredential();

      if (res && res.runtime_credential_id) {
        this.success('Saved runtime credential successfully');
        this.doneCreateCredential = true;
      }
    } else {
      if (isHelm(this.platform)) {
        if (!this.helmNamespace) {
          return this.error('Helm runtime namespace is empty');
        }
      } else if (!selectZone) {
        return this.error('Please select runtime zone');
      }

      if (!name) {
        return this.error('Runtime name is empty');
      }

      // create runtime
      await this.createRuntime({
        name,
        description: desc,
        zone: isHelm(this.platform) ? this.helmNamespace : selectZone,
        provider: this.platform,
        runtime_credential_id: this.selectCredentialId || runtime_credential_id
      });

      if (this.runtime.runtime_id) {
        this.success('Create runtime successfully');
        this.doneCreateRt = true;
      }
    }
  };

  @action
  createRuntime = async (params = {}) => {
    this.isLoading = true;
    const res = await this.request.post(this.createRuntimeAction, params);
    if (_.isObject(res) && res.runtime_id) {
      this.runtime = { ...res };
    }
    this.isLoading = false;
  };

  @action
  changeRuntimeUrl = url => {
    this.runtimeUrl = this.getValueFromEvent(url);
  };

  @action
  changeAccessKey = ak => {
    this.accessKey = this.getValueFromEvent(ak);
  };

  @action
  changeSecretKey = sk => {
    this.secretKey = this.getValueFromEvent(sk);
  };

  @action
  changeHelmCredential = cont => {
    this.helmCredential = this.getValueFromEvent(cont);
  };

  @action
  changeCredentialName = name => {
    this.credentialName = this.getValueFromEvent(name);
  };

  @action
  changeCredentialDesc = desc => {
    this.credentialDesc = this.getValueFromEvent(desc);
  };

  @action
  changeRuntimeZone = zone => {
    this.runtimeInfo.selectZone = zone;
  };

  @action
  changeRuntimeName = name => {
    this.runtimeInfo.name = this.getValueFromEvent(name);
  };

  @action
  changeRuntimeDesc = desc => {
    this.runtimeInfo.desc = this.getValueFromEvent(desc);
  };

  warnTipNamespace = _.throttle(() => {
    this.warn('TIP_HELM_NAMESPACE');
  }, 2000);

  @action
  changeRuntimeNamespace = ns => {
    const value = this.getValueFromEvent(ns);
    if (value !== '' && !regExpNamespace.test(value)) {
      this.warnTipNamespace();
      return;
    }
    this.helmNamespace = value;
  };

  @action
  setValidateMsg = (msg = '', success = false) => {
    this.validateMsg = msg;
    this.validatePassed = success;
  };

  @action
  validateCredential = async () => {
    const params = {
      provider: this.platform
    };

    if (!this.platform) {
      return this.setValidateMsg('invalid provider');
    }

    if (isHelm(this.platform)) {
      if (!this.helmCredential) {
        return this.setValidateMsg('invalid kebeconfig');
      }
      _.extend(params, {
        runtime_url: '',
        runtime_credential_content: this.helmCredential
      });
    } else {
      if (!this.runtimeUrl) {
        return this.setValidateMsg('invalid url');
      }
      if (!(this.accessKey && this.secretKey)) {
        return this.setValidateMsg(
          'access key and secret key should not be empty'
        );
      }
      _.extend(params, {
        runtime_url: this.runtimeUrl,
        runtime_credential_content: this.getCredentialContent()
      });
    }

    const res = await this.credentialStore.validate(params);
    if (_.isObject(res) && res.err) {
      this.setValidateMsg(res.errDetail || res.err);
    } else {
      this.setValidateMsg('', true);
    }
  };

  // choose credential if exist
  @action
  selectCredential = id => {
    this.selectCredentialId = id;
  };

  reset() {
    this.stepOption = { ...defaultStepOption };
    this.runtimeUrl = '';
    this.accessKey = '';
    this.secretKey = '';
    this.helmCredential = '';
    this.credentialName = '';
    this.selectCredentialId = '';
    this.runtime = {};
    this.runtimeInfo = {
      selectZone: '',
      name: '',
      desc: ''
    };
    this.setValidateMsg();
    this.selectCredentialId = '';
    this.showNewlyCreate = false;
    this.doneCreateRt = false;
    this.doneCreateCredential = false;
  }
}
