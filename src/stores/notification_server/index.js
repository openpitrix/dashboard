import { observable, action } from 'mobx';
import _ from 'lodash';

import { TEST_STATUS } from 'config/cloud-env';

import Store from '../Store';

const emailConfig = {
  protocol: 'smtp',
  email_host: '',
  port: '',
  ssl_enable: true,
  display_sender: '',
  email: '',
  password: ''
};

export default class NotificationServerStore extends Store {
  @observable isLoading = false;

  @observable testStatus = '';

  @observable handleType = '';

  @observable emailConfig = Object.assign({}, emailConfig);

  @observable formData = Object.assign({}, emailConfig);

  @action
  reset = () => {
    this.isLoading = false;
    this.testStatus = '';
    this.emailConfig = Object.assign({}, emailConfig);
    this.formData = Object.assign({}, emailConfig);
    this.handleType = '';
  };

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
    const result = await this.request.post('service_configs/get', {
      service_type: ['notification']
    });
    this.emailConfig = _.get(
      result,
      'notification_config.email_service_config'
    );
    if (this.emailConfig) {
      this.formData = Object.assign({}, this.emailConfig);
    }
  };

  @action
  testConnect = async () => {
    if (this.testStatus === 'loading') {
      return;
    }
    this.testStatus = 'loading';
    const result = await this.request.post(
      'service_configs/validate_email_service',
      {
        email_service_config: this.formData
      }
    );
    if (_.get(result, 'is_succ')) {
      this.testStatus = TEST_STATUS.success;
    } else {
      this.testStatus = TEST_STATUS.failed;
    }
  };

  @action
  save = async () => {
    this.isLoading = true;
    const result = await this.request.post('service_configs/set', {
      notification_config: {
        email_service_config: this.formData
      }
    });
    if (_.get(result, 'is_succ')) {
      await this.fetchEmailConfig();
    }
    this.isLoading = false;
  };

  @action
  cancleSave = () => {
    this.handleType = '';
    this.testStatus = '';
    Object.assign(this.formData, this.emailConfig);
  };

  @action
  changeTypeEdit = () => {
    this.handleType = 'edit';
  };
}
