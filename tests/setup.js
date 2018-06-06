import React from 'react';
import { configure, mount, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

configure({ adapter: new Adapter() });

global.requestAnimationFrame =
  global.requestAnimationFrame ||
  function(cb) {
    return setTimeout(cb, 0);
  };

/*
 fix jest unhandle promise
@see https://github.com/facebook/jest/issues/3251
 */
process.on('unhandledRejection', reason => {
  console.log('REJECTION', reason);
});

/*
 fix testing react-popper with jsdom
@see: https://github.com/FezVrasta/popper.js/issues/478
*/
global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY'
  }
});

// attach helpers to global
global.React = React;
global.mount = mount;
global.shallow = shallow;
global.render = render;
global.toJson = toJson;

