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
    const manifest_file = path.join(process.cwd(), `${prefix}/${file}`);
    manifest = JSON.parse(fs.readFileSync(manifest_file, 'utf8'));
  } catch (e) {
    throw Error(`parse ${file} err: ${e.message}`);
  }
  return manifest;
};

const renderPage = (options = {}) => {
  options = Object.assign({}, defaultOptions, options);

  const isProd = Boolean(options.isProd);
  const bundlePrefix = isProd ? '/dist' : '/build';
  let manifest = {};

  if (isProd) {
    manifest = readManifest('manifest.json', bundlePrefix);
  }

  const normalizeCssFilePath = css_file => {
    if (css_file.startsWith('http')) {
      return css_file;
    }
    if (css_file.startsWith('/css')) {
      return `/${css_file}`;
    }

    if (isProd) {
      return manifest[css_file];
    }

    // dev mode
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
    const files = ['vendors.js', 'main.js'];

    return files
      .map(file => {
        file = !isProd ? `${bundlePrefix}/${file}` : manifest[file];
        return `<script defer src="${file}"></script>`;
      })
      .join('\n');
  };

  return `<!doctype html>
<html lang="${options.lang || 'zh'}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="Description" content="OpenPitrix: Application Management Platform on Multi-Cloud Environment">
    <title>${options.title}</title>
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="stylesheet" href="/css/normalize.min.css" />
    <link rel="stylesheet" href="/fonts/roboto/roboto.css" />
    
    ${renderCss(isProd && 'main.css')}
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app</noscript>

    <div id="root">
      ${options.children ? options.children : ''}
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
