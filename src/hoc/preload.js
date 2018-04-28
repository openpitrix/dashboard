import React from 'react';
import { findKey, isArray } from 'lodash';

const compStoreMap = {
  appStore: ['Home', 'AppDeploy', 'AppDetail', 'InstalledApps'],
  clusterStore: ['Clusters', 'ClusterDetail']
};

function getStoreName(comp) {
  // babel will strip displayName of component, add it as static prop
  let compName = comp.displayName || comp.name || 'Home';
  if (compName.indexOf('-') > -1) {
    // mobx inject will modify component name
    compName = compName.split('-')[1];
  }

  return (
    findKey(compStoreMap, names => {
      return names.map(name => name.toLowerCase()).indexOf(compName.toLowerCase()) > -1;
    }) || 'appStore'
  );
}

// preload data, used on server & client
export default function preload(methods) {
  return function(comp) {
    comp.onEnter = async (rootStore, params) => {
      let store = rootStore[getStoreName(comp)];

      if (!methods || typeof methods === 'string') {
        methods = methods || 'fetchAll';
        await store[methods](params);
      } else if (isArray(methods)) {
        methods.map(async method => {
          await store[method](params);
        });
      }
    };

    return comp;
  };
}
