import { observable, action, extendObservable } from 'mobx';
import request from 'lib/request';

export default class OverviewStore {
  @observable overview = {};
  @observable isLoading = false;

  constructor(initialState) {
    if (initialState) {
      extendObservable(this, initialState.overviewStore);
    }
  }

  @action
  async fetchOverview() {
    this.isLoading = true;
    const result = await request.get('api/v1/overview');
    this.categories = result;
    this.isLoading = false;
  }
}
