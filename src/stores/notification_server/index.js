import { observable, action } from 'mobx';

import { sleep } from 'utils';

import Store from '../Store';

const emailConfig = {
  protocol: 'smtp',
  email_host: '',
  port: '',
  ssl_enable: true,
  display_email: '',
  email: '',
  password: ''
};

export default class NotificationServerStore extends Store {
  @observable isLoading = false;

  @observable testStatus = '';

  @observable formData = Object.assign({}, emailConfig);

  @action
  onChangeSelect = value => {
    this.formData.protocol = value;
  };

  @action
  onChangeFormItem = e => {
    if (!e.target) {
      return null;
    }
    const {
      name, value, type, checked
    } = e.target;
    if (type === 'checkbox') {
      this.formData[name] = checked;
    } else {
      this.formData[name] = value;
    }
  };

  @action
  fetchEmailConfig = async () => {
    await this.request.get('service_configs/get', {
      service_type: 'email'
    });
  };

  @action
  testConnect = async () => {
    this.testStatus = 'loading';
    await sleep(1800);
    this.testStatus = 'error';
  };

  @action
  save = async () => {
    this.isLoading = true;
    await this.request.post('service_configs/set', {
      email_service_config: this.formData
    });
    await sleep(300);
    this.isLoading = false;
  };

  @action
  cancleSave = () => {
    Object.assign(this.formData, emailConfig);
  };
}
