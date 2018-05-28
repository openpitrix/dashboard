const apiProto = {
  status: 0, // status code
  result: null,
  success: false,
  msg: '',
  errLevel: '',
  extend: function(...params) {
    return Object.assign(this, ...params);
  },
  setStatus: function(statusCode) {
    this.status = (statusCode / 100) | 0;
    this.errLevel = errLevels[this.status - 1] || 'error';
  },
  getStatus: function() {
    return this.status;
  }
};

const errLevels = ['error', 'info', 'ok', 'clientError', 'serverError'];

let inst = Object.create(apiProto);

module.exports = inst;
