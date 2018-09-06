import { set, decorate, observable } from 'mobx';
import request from 'lib/request';

export default class Store {
  constructor(initialState, branch) {
    this.pageInitMap = {};

    if (initialState) {
      if (branch) {
        set(this, initialState[branch]);
      } else {
        // set rootStore
        Object.getOwnPropertyNames(initialState)
          .filter(prop => !prop.endsWith('Store'))
          .map(prop => {
            set(this, {
              [prop]: initialState[prop]
            });
          });
      }
    }
  }
}

decorate(Store, {
  pageInitMap: observable
});

const allowMethods = ['get', 'post', 'put', 'delete', 'patch'];

Store.prototype = {
  pageSize: 10,
  maxLimit: 200, // fixme: api max returned data count

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
