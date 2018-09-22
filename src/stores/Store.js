import { set, decorate, observable } from 'mobx';
import agent from 'lib/request';

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
    return new Proxy(agent, {
      get: (target, method) => {
        return async (...args) => {
          const url = args[0] || '';
          const params = args[1];

          // forward to node backend
          const res = await target.post(url, { ...params, method });

          // error handling
          if (res && res.err && res.status >= 400) {
            this.error(res.errDetail || res.err || 'internal error');
            return res;
          }

          return res;
        };
      }
    });
  }
};
