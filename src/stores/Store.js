import { set, action } from 'mobx';
import agent from 'lib/request';
import _ from 'lodash';

export default class Store {
  constructor(initialState, branch) {
    this.setInitialState(initialState, branch);
  }

  // will attached to store instance own prop
  @action
  hideModal = () => {
    this.isModalOpen = false;
    this.modalType = '';
  };

  @action
  showModal = (type = '') => {
    this.isModalOpen = true;
    this.modalType = type;
  };
}

Store.prototype = {
  opStore: Symbol('op'), // flag

  setInitialState(initialState = {}, branch) {
    if (_.isEmpty(initialState)) {
      return;
    }

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
  },

  pageSize: 10,
  maxLimit: 200, // fixme: api max returned data count

  info(message) {
    this.notify(message, 'info');
  },
  warn(message) {
    this.notify(message, 'warning');
  },
  success(message) {
    this.notify(message, 'success');
  },
  error(message) {
    this.notify(message, 'error');
  },
  getValueFromEvent(val) {
    if (typeof val === 'object' && val.nativeEvent) {
      return val.currentTarget.value;
    }
    return val;
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

        // error handling
        if (_.isObject(res) && _.has(res, 'err') && res.status >= 400) {
          this.error(res.errDetail || res.err || 'internal error');
          return res;
        }

        return res;
      }
    });
  }
};
