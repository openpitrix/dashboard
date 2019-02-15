// websocket client wrapper
// see compat list: https://caniuse.com/#search=websocket

import Mitt from 'mitt';
import { get, isEmpty } from 'lodash';

let sockInst; // singleton socket client

const defaultOptions = {
  reopenLimit: 2
};
let reopenCount = 0;

const emitter = new Mitt();
const evName = 'ops-resource';

export const getEndpoint = (port, token = '') => {
  const { protocol } = location;
  const ws = protocol === 'http:' ? 'ws:' : 'wss:';
  // todo
  const pathname = '/v1/io';
  return `${ws}//127.0.0.1:${port}${pathname}?sid=${token}`;
};

export default class SockClient {
  constructor(endpoint, options = {}) {
    this.endpoint = endpoint;
    this.options = Object.assign(defaultOptions, options);

    if (!this.endpoint) {
      throw Error(`invalid websocket endpoint: ${this.endpoint}`);
    }

    this.setUp();
  }

  initClient() {
    const subProto = get(this.options, 'subProtocol');
    if (!sockInst) {
      sockInst = new WebSocket(this.endpoint, subProto);
    }
    if (sockInst && sockInst.readyState > 1) {
      sockInst.close();
      sockInst = new WebSocket(this.endpoint, subProto);
    }

    this.client = sockInst;
    return this.client;
  }

  attachEvents() {
    this.client.onopen = () => console.log('open socket: ', this);

    this.client.onmessage = message => {
      let data = message.data || {};
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      emitter.emit(evName, data);
    };

    this.client.onclose = () => {
      // if sock will close, try to keep alive
      if (reopenCount < this.options.reopenLimit) {
        setTimeout(this.setUp.bind(this), 2000);
        reopenCount++;
      }
    };

    this.client.onerror = ev => console.error('sock err: ', ev);
  }

  send(data) {
    return this.client.send(data);
  }

  setUp() {
    this.initClient();
    this.attachEvents();
  }

  listenToJob(handler) {
    emitter.on(evName, handler);
  }

  unlisten(handler) {
    if (typeof handler === 'function') {
      emitter.off(evName, handler);
    }
  }
}
