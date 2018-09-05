import { extendObservable } from 'mobx';
import request from 'lib/request';

export default class Store {
  pageSize = 10;
  maxLimit = 200;

  constructor(initialState, branch) {
    // fixme: upgrade mobx
    extendObservable(this, {
      pageInitMap: {}
    });

    if (initialState) {
      extendObservable(this, branch ? initialState[branch] : initialState);
    }
  }
}

const allowMethods = ['get', 'post', 'put', 'delete', 'patch'];

Store.prototype = {
  info: function(message) {
    this.notify(message, 'info');
  },
  success: function(message) {
    this.notify(message, 'success');
  },
  error: function(message) {
    this.notify(message, 'error');
  },
  get request() {
    return new Proxy(request, {
      get: (target, method) => {
        return async (...args) => {
          let url = args[0];
          let params = args[1];
          let res;

          if (allowMethods.includes(method)) {
            // decorate url
            if (typeof url === 'string') {
              if (!/^\/?api\//.test(url)) {
                url = '/api/' + url;
              }
              res = await target.post(url, { ...params, method });
            }
          } else if (typeof target[method] === 'function') {
            res = target[method].apply(args);
          }

          // error handling
          if (res.err && res.status >= 400) {
            this.error(res.errDetail || res.err || 'internal error');
            return res;
          }

          return res;
        };
      }
    });
  }
};
