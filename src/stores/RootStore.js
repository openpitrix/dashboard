import { extendObservable } from 'mobx';

import AppStore from './AppStore';
import ClusterStore from './ClusterStore';

export default class RootStore {
  config = {}

  constructor(initialState) {
    if (initialState) {
      extendObservable(this, initialState);
    }

    this.appStore = new AppStore(initialState);
    this.clusterStore = new ClusterStore(initialState);
  }
}
