import { extendObservable, observable, action } from 'mobx';
import { isEmpty, isObject, pick } from 'lodash';
import request from 'lib/request';

export default class Store {
  pageSize = 10;

  constructor(initialState, branch) {
    extendObservable(this, {
      pageInitMap: {},
      notifyType: observable.box('success'),
      notifyMsg: observable.box(''),
      sockMessage: observable.box('') // json.string socket message
    });

    if (initialState) {
      extendObservable(this, branch ? initialState[branch] : initialState);
    }
  }
}

const allowMehhods = ['get', 'post', 'put', 'delete', 'patch'];

Store.prototype = {
  @action.bound
  showMsg: function(msg, type) {
    this.notifyMsg = msg;
    if (type) {
      this.notifyType = type;
    } else {
      this.notifyType = 'error';
    }
  },
  @action.bound
  hideMsg: function() {
    this.notifyMsg = '';
  },
  @action.bound
  apiMsg: function(result) {
    if (typeof result === 'string') {
      this.showMsg(result);
    } else if (typeof result === 'object') {
      this.showMsg(result.err ? result.errDetail : 'Operation done');
    }
  },
  postHandleApi(result, cb) {
    this.apiMsg(result);
    if (!result || !result.err) {
      typeof cb === 'function' && cb();
    }
  },
  get request() {
    return new Proxy(request, {
      get: (target, method) => {
        return async (...args) => {
          let url = args[0];
          let params = args[1];
          let res;

          if (allowMehhods.includes(method)) {
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
            this.notify(res.err || res.errDetail || 'internal error');
            return;
          }

          return res;
        };
      }
    });
  },

  @action.bound
  setSocketMessage: function(message = '') {
    this.sockMessage = typeof message === 'object' ? JSON.stringify(message) : message.toString();
  },
  sockMessageChanged: function(message = '') {
    message = typeof message === 'object' ? JSON.stringify(message) : message.toString();
    return this.sockMessage + '' === message;
  }
};
