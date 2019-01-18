import { observable, action } from 'mobx';

import { sleep } from 'utils';

import Store from '../Store';

const emailConfig = {
  type: 'smtp',
  server_name: '',
  server_port: '',
  ssl_connect: true,
  email: '',
  username: '',
  password: ''
};

export default class NotificationServerStore extends Store {
  @observable isLoading = false;

  @observable testStatus = '';

  @observable formData = Object.assign({}, emailConfig);

  @action
  onChangeSelect = value => {
    this.formData.type = value;
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
  testConnect = async () => {
    this.testStatus = 'loading';
    await sleep(1800);
    this.testStatus = 'success';
  };

  @action
  save = async () => {
    this.isLoading = true;
    await sleep(300);
    this.isLoading = false;
  };

  @action
  cancleSave = () => {
    Object.assign(this.formData, emailConfig);
  };
}
