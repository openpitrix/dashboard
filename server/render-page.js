const fs = require('fs');
const path = require('path');
const template = require('lodash/template');
const pick = require('lodash/pick');

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

const isProd = process.env.NODE_ENV === 'production';
const bundlePrefix = isProd ? '/dist' : '/build';
let manifest = {};

if (isProd) {
  manifest = readManifest('manifest.json', bundlePrefix);
}

const normalizeCssFilePath = css_file => {
  if (css_file.startsWith('http') || css_file.startsWith('/css')) {
    return css_file;
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
  const files = ['vendors.js', 'main.js'];

  return files
    .map(file => {
      file = !isProd ? `${bundlePrefix}/${file}` : manifest[file];
      return `<script src="${file}"></script>`;
    })
    .join('\n');
};

module.exports = (ctx, options = {}) => {
  options = Object.assign(
    {
      title: 'Openpitrix Dashboard',
      state: '{}',
      children: null
    },
    options
  );

  if (!ctx.app._page) {
    // cache page template
    ctx.app._page = fs.readFileSync(path.resolve('server/page.html'), 'utf-8');
  }

  return template(ctx.app._page)(
    Object.assign({}, pick(options, ['lang', 'title', 'children', 'state']), {
      styles: renderCss(isProd && 'main.css'),
      scripts: renderJs()
    })
  );
};
