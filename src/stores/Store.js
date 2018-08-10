import { extendObservable, observable, action } from 'mobx';
import request from 'lib/request';

export default class Store {
  pageSize = 10;

  constructor(initialState, branch) {
    extendObservable(this, {
      pageInitMap: {},
      sockMessage: observable.box('') // json.string socket message
    });

    if (initialState) {
      extendObservable(this, branch ? initialState[branch] : initialState);
    }
  }
}

const allowMehhods = ['get', 'post', 'put', 'delete', 'patch'];

const getMessage = message => {
  return typeof message === 'object' ? JSON.stringify(message) : message.toString();
};

Store.prototype = {
  @action.bound
  showMsg: function(message, type) {
    // back compat
    this.notify({ message, type });
  },
  @action.bound
  apiMsg: function(result, successTip, failTip, cb) {
    if (arguments.length > 1 && typeof arguments[arguments.length - 1] === 'function') {
      cb = arguments[arguments.length - 1];
    }

    if (typeof successTip !== 'string' || !successTip) {
      successTip = 'Operation successfully';
    }
    if (typeof failTip !== 'string' || !failTip) {
      failTip = 'Operation failed';
    }

    let apiSuccess = !result || !result.err;
    if (apiSuccess) {
      this.showMsg(successTip, 'success');
    } else {
      this.showMsg(failTip);
    }

    typeof cb === 'function' && apiSuccess && cb();
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
            this.notify(res.errDetail || res.err || 'internal error');
            return res;
          }

          return res;
        };
      }
    });
  },

  @action.bound
  setSocketMessage: function(message = '') {
    this.sockMessage = getMessage(message);
  },
  sockMessageChanged: function(message = '') {
    return this.sockMessage + '' === getMessage(message);
  }
};
