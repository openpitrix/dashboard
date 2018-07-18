// websocket client wrapper
// see compat list: https://caniuse.com/#search=websocket

let sockInst; // singleton socket client

const readyStates = ['connecting', 'open', 'closing', 'closed'];

class SockClient {
  static composeEndpointFromApiServer = (apiServer)=> {
    const re=/(https?:\/\/)?([^\/]+)/;
    const suffix = '/v1/io?uid=system';
    let matchParts = (apiServer+'').match(re);
    return `ws://${matchParts[2]}${suffix}`;
  }

  constructor(endpoint, subProtocol){
    this.endpoint = endpoint;
    this.subProtocol=subProtocol;
    if(!this.endpoint){
      throw Error(`invalid websocket endpoint: ${this.endpoint}`);
    }

    this.client = this.initClient();
  }

  getEndpoint(){
    return this.endpoint;
  }

  getSockState(readyState){
    if(readyState === undefined){
      readyState = this.client.readyState;
    }

    return readyStates[readyState];
  }

  initClient(){
    if(!sockInst){
      sockInst = new WebSocket(this.endpoint, this.subProtocol);
    }
    if(sockInst && this.getSockState(sockInst.readyState) === 'closed'){
      sockInst.close();
      sockInst = new WebSocket(this.endpoint, this.subProtocol);
    }
    return sockInst;
  }

  attachEvents(){
    // todo
    if(!this.client.onopen){
      this.client.onopen = ev=> console.log('sock open: ', ev);
    }
    if(!this.client.onmessage){
      this.client.onmessage = ev=> console.log('sock message: ', ev.message);
    }
    if(!this.client.onclose){
      this.client.onclose = ev=> console.log('sock closing: ', ev)
    }
    if(!this.client.onerror){
      this.client.onerror=ev=> console.error('sock err: ', ev)
    }
  }

  send(data){
    return this.client.send(data);
  }

  setUp(){
    if(!this.client){
      this.initClient();
    }

    this.attachEvents();
  }
}

export default SockClient;