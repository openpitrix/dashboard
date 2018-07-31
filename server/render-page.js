const fs = require('fs');
const path = require('path');

const defaultOptions = {
  title: 'Openpitrix Dashboard',
  state: '{}',
  children: ''
};

const readManifest = (file, prefix = '/dist') => {
  let manifest = {};
  try {
    let manifest_file = path.join(process.cwd(), `${prefix}/${file}`);
    manifest = JSON.parse(fs.readFileSync(manifest_file, 'utf8'));
  } catch (e) {
    throw Error(`parse ${file} err: ${e.message}`);
  }
  return manifest;
};

const renderPage = (options = {}) => {
  Object.assign(defaultOptions, options);

  const isProd = !!options.isProd;
  const bundlePrefix = isProd ? '/dist' : '/build';

  const manifest = readManifest('build-hash.json');

  const normalizeCssFilePath = css_file => {
    if (css_file.startsWith('http')) {
      return css_file;
    }
    if (css_file.startsWith('/css')) {
      return `/assets${css_file}`;
    }

    if (isProd) {
      css_file = `${css_file}?${manifest.hash}`;
    }

    return path.join(bundlePrefix, css_file);
  };

  const renderCss = (files = []) => {
    if (!Array.isArray(files)) {
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
    // todo
    const files = isProd ? ['main.js'] : ['vendors.js', 'main.js'];

    return files
      .map(file => {
        file = `${bundlePrefix}/${file}`;
        if (isProd) {
          file += `?${manifest.hash}`;
        }

        return `<script defer src="${file}"></script>`;
      })
      .join('\n');
  };

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>${options.title}</title>
    <link rel="shortcut icon" href="/assets/favicon.ico" />
    <link rel="stylesheet" href="/assets/css/normalize.min.css" />
    <link rel="stylesheet" href="/assets/fonts/roboto/roboto.css" />
    ${renderCss('https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css')}
    ${renderCss(
      !isProd
        ? '/css/bootstrap.min.css'
        : 'https://cdn.bootcss.com/bootstrap/4.0.0/css/bootstrap.min.css'
    )}
    ${renderCss(isProd && 'bundle.css')}
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app</noscript>

    <div id="root">
      ${options.children ? `<div id="root">${options.children}</div>` : `<div id="root"></div>`}
    </div>
    
    <script>
      window.__INITIAL_STATE__ = ${options.state} 
    </script>

    ${renderJs()}
  </body>
</html>
`;
};

module.exports = renderPage;
