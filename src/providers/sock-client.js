// websocket client wrapper
// see compat list: https://caniuse.com/#search=websocket

import Mitt from 'mitt';
import { get, isEmpty } from 'lodash';

let inst = null;
let sockInst; // singleton socket client

const readyStates = ['connecting', 'open', 'closing', 'closed'];
const defaultOptions = {
  reopenLimit: 2
};
let reopenCount = 0;

const emitter = new Mitt();

export const getSock = (sockUrl, token) => {
  if (inst && inst instanceof SockClient) {
    return inst;
  }
  inst = new SockClient(SockClient.composeEndpoint(sockUrl, token));
  inst.setUp();

  return inst;
};

export default class SockClient {
  static composeEndpoint = (socketUrl, accessToken = '') => {
    const re = /wss?:\/\/([^\\?]+)/;
    const suffix = `?sid=${accessToken}`;
    const matchParts = `${socketUrl}`.match(re);

    if (!matchParts) {
      throw Error(`Invalid socket url: ${socketUrl}`);
    }

    return `${matchParts[0]}${suffix}`;
  };

  constructor(endpoint, options = {}) {
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
    // todo
    if (!this.client.onopen) {
      this.client.onopen = ev => console.log('open socket: ', ev);
    }

    if (!this.client.onmessage) {
      this.client.onmessage = message => {
        let data = message.data || {};
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }

        emitter.emit(`ops-resource`, data);
      };
    }

    if (!this.client.onclose) {
      this.client.onclose = () => {
        // if sock will close, try to keep alive
        if (reopenCount < this.options.reopenLimit) {
          setTimeout(this.setUp.bind(this), 2000);
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

  listenToJob(cb) {
    emitter.on('ops-resource', (payload = {}) => {
      const { type } = payload;
      const { resource = {} } = payload;

      cb({
        op: `${type}:${resource.rtype}`,
        type,
        ...resource
      });
    });
  }

  clean() {
    if (!isEmpty(this._events)) {
      this._events = {};
    }

    emitter.off('*');
  }
}
