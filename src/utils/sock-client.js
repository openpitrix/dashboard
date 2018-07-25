// websocket client wrapper
// see compat list: https://caniuse.com/#search=websocket

import EventEmitter from 'events';
import { get, debounce } from 'lodash';

let sockInst; // singleton socket client

const readyStates = ['connecting', 'open', 'closing', 'closed'];
const defaultOptions = {
  reopenLimit: 3
};
let reopenCount = 0;

class SockClient extends EventEmitter {
  static composeEndpoint = socketUrl => {
    const re = /(\w+?:\/\/)?([^\\?]+)/;
    const suffix = '?uid=system'; // todo: suffix is hard coded
    const matchParts = (socketUrl + '').match(re);
    return `ws://${matchParts[2]}${suffix}`;
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
      this.client.onopen = ev => console.log('sock open: ', ev);
    }

    if (!this.client.onmessage) {
      this.client.onmessage = message => {
        let data = message.data;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }

        console.log('sock message: ', data);
        this.emit(`ops-resource`, data);
      };
    }

    if (!this.client.onclose) {
      this.client.onclose = ev => {
        console.log('sock closing: ', ev);
        // if sock will close, try to keep alive
        if (reopenCount < this.options.reopenLimit) {
          console.log('reopen socket..');
          setTimeout(this.setUp.bind(this), 1000);
          // this.setUp();
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
