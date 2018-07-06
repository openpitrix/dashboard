const reportErr = (err, ctx) => {
  // ctx.status = err.statusCode || err.status || 500;
  // ctx.body = err.message;
  ctx.app.emit('error', err, ctx);
};

const renderErrPage = (err = {}) => {
  const title = `OpenPitrix Error: ${err.name || ''}`;
  const message = err.message || '';
  const stack = err.stack || '';

  return `<!doctype html><html>
    <head>
      <title>OpenPitrix Error: ${title}</title>
      
      <style>
        .err-message {
          font-size: 1.2em;
          color: #e22a2a;
        }
        .err-stack {
          
        }
      </style>
    </head>
    <body>
      <h2 class="err-message">${message}</h2>
      <pre class="err-stack">${stack}</pre>
    </body></html>
  `;
};

module.exports = {
  reportErr,
  renderErrPage
};
