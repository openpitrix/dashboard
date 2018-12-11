import { observable, action } from 'mobx';

import Store from '../Store';

export default class TestingEnvStore extends Store {
  @observable platform = '';

  @action
  setPlatform = platform => {
    this.platform = platform;
  };
}
