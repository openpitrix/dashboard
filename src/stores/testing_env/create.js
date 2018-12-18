import { observable, action } from 'mobx';
import _ from 'lodash';

import { isHelm } from 'utils';
import Store from '../Store';

const STEPS = 2;

const defaultStepOption = {
  steps: STEPS,
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

  @observable credentialContent = '';

  @observable authInfoName = '';

  @observable validatePassed = false;

  @observable validateMsg = '';

  get envStore() {
    return this.getStore('testingEnv');
  }

  get credentialStore() {
    return this.getStore('runtimeCredential');
  }

  @action
  prevStep = () => {
    if (this.stepOption.activeStep > 1) {
      this.stepOption.activeStep--;
    }
  };

  @action
  nextStep = () => {
    if (!this.validatePassed) {
      return this.error('Please validate env auth info');
    }
    if (this.stepOption.activeStep < STEPS) {
      this.stepOption.activeStep++;
    }
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
  changeCredentialContent = cont => {
    this.credentialContent = this.getValueFromEvent(cont);
  };

  changeAuthInfoName = name => {
    this.authInfoName = this.getValueFromEvent(name);
  };

  @action
  setValidateMsg = (msg = '', success = false) => {
    this.validateMsg = msg;
    this.validatePassed = success;
  };

  @action
  validateCredential = async () => {
    const { platform } = this.envStore;
    const params = {
      runtime_url: this.runtimeUrl,
      provider: platform
    };

    if (!platform) {
      this.setValidateMsg('invalid provider');
      return;
    }
    if (!this.runtimeUrl) {
      this.setValidateMsg('invalid url');
      return;
    }

    if (isHelm(platform)) {
      params.credential = '';
    } else {
      if (!(this.accessKey && this.secretKey)) {
        this.setValidateMsg('access key and secret key should not be empty');
        return;
      }

      params.runtime_credential_content = JSON.stringify({
        access_key_id: this.accessKey,
        secret_access_key: this.secretKey
      });
    }
    const res = await this.credentialStore.validate(params);
    if (_.isObject(res) && res.err) {
      this.setValidateMsg(res.errDetail || res.err);
    } else {
      this.setValidateMsg('', true);
    }
  };

  reset() {
    this.stepOption = { ...defaultStepOption };
    this.runtimeUrl = '';
    this.accessKey = '';
    this.secretKey = '';
    // this.credentialContent='';
    this.authInfoName = '';
    this.setValidateMsg();
  }
}
