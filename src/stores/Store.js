import { extendObservable } from 'mobx';
import { isEmpty, pick } from 'lodash';
import request from 'lib/request';

export default class Store {
  pageSize = 10;

  constructor(initialState, branch) {
    if (initialState) {
      extendObservable(this, branch ? initialState[branch] : initialState);

      if (!request.getOptions('prefix')) {
        request.setOptions({ prefix: initialState.apiServer });
      }
    }
  }
}

const allowMehhods = ['get', 'post', 'put', 'delete', 'patch'];

Store.prototype = {
  showMsg: function(msg) {
    this.root.showMsg(msg);
  },
  hideMsg: function() {
    this.root.hideMsg();
  },
  request: new Proxy(request, {
    get: (target, method) => {
      return async (...args) => {
        let url = args[0];
        let params = args[1];

        if (allowMehhods.indexOf(method) > -1) {
          // decorate url
          if (typeof url === 'string') {
            if (!/^\/?api\//.test(url)) {
              url = '/api/' + url;
            }
            return await target.post(url, { ...params, method });
          }
        } else if (typeof target[method] === 'function') {
          return target[method].apply(args);
        }

        throw Error(`invalid request method: ${method}`);
      };
    }
  })
};
