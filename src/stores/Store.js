import { extendObservable } from 'mobx';
import { isEmpty, pick } from 'lodash';
import Request from 'lib/request';

export default class Store {
  config = {};

  constructor(initialState, branch) {
    if (initialState) {
      extendObservable(this, branch ? initialState[branch] : initialState);
    }

    if (isEmpty(this.config)) {
      this.config = pick(initialState, ['config', 'serverUrl']);

      Request.setOptions({ prefix: this.config.serverUrl });
    }
  }

  get request() {
    return Request;
  }
}
