import { observable, action } from 'mobx';
import _ from 'lodash';

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

  @observable emailConfig = Object.assign({}, emailConfig);

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
    this.testStatus = 'loading';
    await sleep(1800);
    this.testStatus = 'failed';
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
    Object.assign(this.formData, this.emailConfig);
  };
}
