const apiProto = {
  status: 0, // status code
  result: null,
  success: false,
  msg: '',
  errLevel: '',
  extend(...params) {
    return Object.assign(this, ...params);
  },
  setStatus(statusCode) {
    this.status = (statusCode / 100) | 0;
    this.errLevel = errLevels[this.status - 1] || 'error';
  },
  getStatus() {
    return this.status;
  }
};

const errLevels = ['error', 'info', 'ok', 'clientError', 'serverError'];

const inst = Object.create(apiProto);

module.exports = inst;
