import { set } from 'mobx';
import agent from 'lib/request';
import _ from 'lodash';

export default class Store {
  constructor(initialState, branch) {
    if (initialState) {
      if (branch) {
        set(this, initialState[branch]);
      } else {
        // set rootStore
        Object.getOwnPropertyNames(initialState)
          .filter(prop => !prop.endsWith('Store'))
          .forEach(prop => {
            set(this, {
              [prop]: initialState[prop]
            });
          });
      }
    }
  }
}

Store.prototype = {
  pageSize: 10,
  maxLimit: 200, // fixme: api max returned data count

  info(message) {
    this.notify(message, 'info');
  },
  success(message) {
    this.notify(message, 'success');
  },
  error(message) {
    // Can't get token will skip to the login page
    if (message === 'Unauthorized') {
      const { pathname } = location;
      if (pathname && pathname !== '/') {
        location.href = `/login?url=${pathname}`;
      }
    }

    this.notify(message, 'error');
  },
  /**
   * used in list page fetch all data
   *
   * @param params
   * @returns {*}
   */
  normalizeParams(params = {}) {
    const sortKey = this.sortKey || 'create_time';
    const currentPage = this.currentPage || 1;
    const defaultParams = {
      sort_key: sortKey,
      limit: this.pageSize,
      offset: (currentPage - 1) * this.pageSize,
      status: !_.isEmpty(this.selectStatus)
        ? this.selectStatus
        : this.defaultStatus || []
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
      get: (target, method) => async (...args) => {
        const url = args[0] || '';
        const params = _.omitBy(
          args[1],
          val => val === undefined || val === null
        );

        // forward to node backend
        const res = await target.post(url, { method, ...params });

        if (res && res.status >= 300 && res.status < 400) {
          location.href = res.message || '/login';
        }

        // error handling
        if (res && res.err && res.status >= 400) {
          this.error(res.errDetail || res.err || 'internal error');
          return res;
        }

        return res;
      }
    });
  }
};
