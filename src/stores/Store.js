import { extendObservable } from 'mobx';
import { isEmpty, pick } from 'lodash';
import request from 'lib/request';

let sharedConfig = {};

export default class Store {
  constructor(initialState, branch) {
    if (initialState) {
      extendObservable(this, branch ? initialState[branch] : initialState);
    }

    if (isEmpty(sharedConfig)) {
      sharedConfig = pick(initialState, ['config', 'serverUrl', 'apiVersion']);
    }

    if (!this.request.getOptions('prefix') && sharedConfig.serverUrl) {
      this.request.setOptions({
        prefix: sharedConfig.serverUrl
      });
    }
  }
}

Store.prototype = {
  getConfig: () => sharedConfig,
  setConfig: config => Object.assign(sharedConfig, config),
  request: new Proxy(request, {
    get: (target, method) => {
      return (...args) => {
        let url = args[0];
        let params = args[1];
        if (target.hasOwnProperty(method) && typeof target[method] === 'function') {
          // decorate url
          if (typeof url === 'string') {
            if (!url.startsWith('api') || !url.startsWith('/api')) {
              url = `api/${sharedConfig.apiVersion}/${url.trimLeft('/')}`;
            }
          }
          return target[method](url, params);
        }
        throw Error(`invalid request method: ${method}`);
      };
    }
  })
};
