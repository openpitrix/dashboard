// websocket client wrapper
// see compat list: https://caniuse.com/#search=websocket

import EventEmitter from 'events';
import { get, debounce } from 'lodash';

let sockInst; // singleton socket client

const readyStates = ['connecting', 'open', 'closing', 'closed'];
const defaultOptions = {
  reopenLimit: 2
};
let reopenCount = 0;

class SockClient extends EventEmitter {
  static composeEndpoint = (socketUrl, accessToken = '') => {
    const re = /(\w+?:\/\/)?([^\\?]+)/;
    const suffix = `?sid=${accessToken}`;
    const matchParts = (socketUrl + '').match(re);
    let wsPrefix = 'ws://';
    if (typeof window === 'object' && window.location.protocol === 'https:') {
      wsPrefix = 'wss://';
    }

    return `${wsPrefix}${matchParts[2]}${suffix}`;
  };

  constructor(endpoint, options = {}) {
    super();
    this.endpoint = endpoint;
    this.options = Object.assign(defaultOptions, options);

    if (!this.endpoint) {
      throw Error(`invalid websocket endpoint: ${this.endpoint}`);
    }
    this.initClient();
  }

  getSockState(readyState) {
    if (readyState === undefined) {
      readyState = this.client.readyState;
    }

    return readyStates[readyState];
  }

  initClient() {
    let subProto = get(this.options, 'subProtocol');
    if (!sockInst) {
      sockInst = new WebSocket(this.endpoint, subProto);
    }
    if (sockInst && sockInst.readyState > 1) {
      sockInst.close();
      sockInst = new WebSocket(this.endpoint, subProto);
    }

    return (this.client = sockInst);
  }

  attachEvents() {
    // todo
    if (!this.client.onopen) {
      this.client.onopen = ev => console.log('open socket: ', ev);
    }

    if (!this.client.onmessage) {
      this.client.onmessage = message => {
        let data = message.data || {};
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (err) {}
        }

        // console.log('sock message: ', data);
        this.emit(`ops-resource`, data);
      };
    }

    if (!this.client.onclose) {
      this.client.onclose = ev => {
        // if sock will close, try to keep alive
        if (reopenCount < this.options.reopenLimit) {
          setTimeout(this.setUp.bind(this), 1500);
          reopenCount++;
        }
      };
    }

    if (!this.client.onerror) {
      this.client.onerror = ev => console.error('sock err: ', ev);
    }
  }

  send(data) {
    return this.client.send(data);
  }

  setUp() {
    this.initClient();
    this.attachEvents();
  }
}

export default SockClient;
