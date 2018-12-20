import { observable, action } from 'mobx';
import _ from 'lodash';

import { isHelm } from 'utils';
import { getUrlParam } from 'utils/url';
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

  get envStore() {
    return this.getStore('testingEnv');
  }

  get credentialStore() {
    return this.getStore('runtimeCredential');
  }

  get isCredential() {
    return getUrlParam('type') === 'credential';
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
      name: this.credentialName,
      description: ''
    };
  }

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
    if (this.stepOption.activeStep > 1) {
      this.stepOption.activeStep--;
    }
  };

  @action
  nextStep = async () => {
    const { platform } = this.envStore;

    if (this.stepOption.activeStep < STEPS) {
      if (this.selectCredentialId) {
        // todo
      } else {
        // newly create
        if (!this.validatePassed) {
          return this.error('Please validate runtime credential');
        }
        if (this.validatePassed && !this.isCredential && !this.credentialName) {
          return this.error('Auth info name is empty');
        }

        if (isHelm(platform)) {
          // todo
        } else {
          await this.saveCredential();
        }
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
    const { platform } = this.envStore;
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
      if (isHelm(platform)) {
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
        zone: selectZone,
        provider: platform,
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
  changeHelmCredential = cont => {
    this.helmCredential = this.getValueFromEvent(cont);
  };

  @action
  changeCredentialName = name => {
    this.credentialName = this.getValueFromEvent(name);
  };

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

  @action
  setValidateMsg = (msg = '', success = false) => {
    this.validateMsg = msg;
    this.validatePassed = success;
  };

  @action
  validateCredential = async () => {
    const platform = getUrlParam('provider') || this.envStore.platform;
    const params = {
      provider: platform
    };

    if (!platform) {
      return this.setValidateMsg('invalid provider');
    }

    if (isHelm(platform)) {
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
