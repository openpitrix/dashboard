import { configure } from '@storybook/react';

function loadStories() {
  require('../stories');

  const req = require.context('../stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
