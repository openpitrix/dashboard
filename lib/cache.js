// sessionStorage cache
import { isFunction, isUndefined, isObject } from 'lodash';

const defaults = {
  expires: 7 * 24 * 60 * 60 * 1000,
  prefix: 'op_dashboard_',
  keyGen: null
};

class Cache {
  constructor(opts = {}) {
    Object.assign(this, defaults, opts);
  }

  getCacheKey(key) {
    return isFunction(this.keyGen) ? this.keyGen(key) : `${this.prefix}${key}`;
  }

  get(key) {
    const cacheKey = this.getCacheKey(key);
    let val = sessionStorage.getItem(cacheKey);

    if (isUndefined(val)) {
      return null;
    }

    try {
      val = JSON.parse(val);
      if (!isObject(val) || !val.ts || isUndefined(val.data)) {
        return null;
      }

      // check expire time
      const { ts, data } = val;
      if (parseInt(ts) - Date.now() > this.expires) {
        return null;
      }

      return data;
    } catch (err) {
      return null;
    }
  }

  set(key, val) {
    sessionStorage.setItem(
      this.getCacheKey(key),
      JSON.stringify({
        ts: Date.now(),
        data: val
      })
    );
  }

  clear(key) {
    if (isUndefined(key)) {
      // clear all cache values with this.prefix
      Object.getOwnPropertyNames(sessionStorage)
        .filter(name => name.startsWith(this.prefix))
        .forEach(name => {
          sessionStorage.removeItem(name);
        });
    } else {
      sessionStorage.removeItem(this.getCacheKey(key));
    }
  }
}

export default Cache;
