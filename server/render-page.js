const path = require('path');
const { isArray, pick } = require('lodash');

const renderPage = (options = {}) => {
  const opt = pick(options, ['isDev', 'isLogin', 'title', 'children', 'state']);

  const isDev = !!opt.isDev;
  const isLogin = !!opt.isLogin;
  const bundlePrefix = isDev ? '/build' : '/dist';

  const title = opt.title || 'Openpitrix Dashboard';
  const state = opt.state || '{}';
  const children = opt.children || '';

  const normalizeCssFilePath = css_file => {
    if (css_file.startsWith('http')) {
      return css_file;
    }
    if (css_file.startsWith('/css')) {
      return `/assets${css_file}`;
    }
    return path.join(bundlePrefix, css_file);
  };

  const renderCss = (files = []) => {
    if (!isArray(files)) {
      files = [files];
    }
    return files
      .filter(Boolean)
      .map(file => {
        file = normalizeCssFilePath(file);
        return `<link rel="stylesheet" href="${file}" />`;
      })
      .join('\n');
  };

  const renderJs = () => {
    let snip = '';
    if (isDev) {
      snip += ['vendors']
        .map(file => `<script src="${bundlePrefix}/${file}.js"></script>`)
        .join('\n');
    }
    snip += `<script src="${bundlePrefix}/main.js"></script>`;
    return snip;
  };

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>${title}</title>
    <link rel="shortcut icon" href="/assets/favicon.ico" />
    <link rel="stylesheet" href="/assets/css/normalize.min.css" />
    <link rel="stylesheet" href="/assets/fonts/roboto/roboto.css" />
    ${renderCss(isDev && 'https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css')}
    ${renderCss(
      isDev
        ? '/css/bootstrap.min.css'
        : 'https://cdn.bootcss.com/bootstrap/4.0.0/css/bootstrap.min.css'
    )}
    ${renderCss(!isDev && 'bundle.css')}
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app</noscript>

    <div id="root">
      ${children}
    </div>
    
    <script>
      window.__INITIAL_STATE__ = ${state} 
    </script>

    ${renderJs()}
  </body>
</html>
`;
};

module.exports = renderPage;
