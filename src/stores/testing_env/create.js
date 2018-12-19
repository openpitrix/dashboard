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

  // create runtime, provide runtime info
  @observable
  runtimeInfo = {
    selectZone: '',
    name: '',
    desc: ''
  };

  // last created runtime
  @observable runtime = {};

  get envStore() {
    return this.getStore('testingEnv');
  }

  get credentialStore() {
    return this.getStore('runtimeCredential');
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
      runtime_credential_content: this.getCredentialContent(),
      provider: this.envStore.platform,
      name: this.authInfoName,
      description: ''
    };
  }

  @action
  prevStep = () => {
    if (this.stepOption.activeStep > 1) {
      this.stepOption.activeStep--;
    }
  };

  @action
  nextStep = async () => {
    if (!this.validatePassed) {
      return this.error('Please validate env auth info');
    }
    if (this.validatePassed && !this.authInfoName) {
      return this.error('Auth info name is empty');
    }

    const { platform } = this.envStore;
    const { runtime_credential_id } = this.credentialStore.credential;

    if (this.stepOption.activeStep < STEPS) {
      if (isHelm(platform)) {
        // create credential for helm type
      } else {
        // create credential for vm type
        if (!runtime_credential_id) {
          await this.credentialStore.create(this.getCredentialParams());
        } else {
          // modify exist credential
          const res = await this.credentialStore.modify(
            _.extend(
              _.omit(this.getCredentialParams(), ['runtime_url', 'provider']),
              { runtime_credential_id }
            )
          );

          if (res && res.runtime_credential_id) {
            this.info('Saved runtime credential');
          }
        }
      }

      this.stepOption.activeStep++;
    }

    if (this.stepOption.activeStep === STEPS) {
      const { selectZone, name, desc } = this.runtimeInfo;
      if (!selectZone) {
        return this.error('Please select runtime zone');
      }
      if (!name) {
        return this.error('Runtime is empty');
      }

      await this.createRuntime({
        name,
        description: desc,
        zone: selectZone,
        provider: platform,
        runtime_credential_id
      });

      if (this.runtime.runtime_id) {
        this.success('Create runtime successfully');
      }
    }
  };

  @action
  createRuntime = async (params = {}) => {
    this.isLoading = true;
    const res = await this.request.post('runtimes', params);
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
  changeCredentialContent = cont => {
    this.credentialContent = this.getValueFromEvent(cont);
  };

  @action
  changeAuthInfoName = name => {
    this.authInfoName = this.getValueFromEvent(name);
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

      params.runtime_credential_content = this.getCredentialContent();
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
