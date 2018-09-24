import { set, decorate, observable } from 'mobx';
import agent from 'lib/request';
import _ from 'lodash';

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
  /**
   * used in list page fetch all data
   *
   * @param params
   * @returns {*}
   */
  normalizeParams(params={}) {
    const sortKey = this.sortKey || 'create_time';
    const currentPage = this.currentPage || 1;
    const defaultParams = {
      sort_key: sortKey,
      limit: this.pageSize,
      offset: (currentPage - 1) * this.pageSize,
      status: !_.isEmpty(this.selectStatus) ? this.selectStatus : (this.defaultStatus || [])
    };

    if (params.noLimit) {
      defaultParams.limit = this.maxLimit;
      defaultParams.offset = 0;
      delete params.noLimit;
    }

    return _.extend({}, defaultParams, params);
  },
  get request() {
    return new Proxy(agent, {
      get: (target, method) => {
        return async (...args) => {
          const url = args[0] || '';
          const params = args[1];

          // forward to node backend
          const res = await target.post(url, { method, ...params });

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
