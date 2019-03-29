import { observable } from 'mobx';
import { isEmpty, omitBy } from 'lodash';

import history from 'createHistory';
import { obj2Qs, qs2Obj } from 'utils';

export default {
  @observable selectedRowKeys: [],
  @observable selectIds: [],
  @observable selectStatus: '',
  @observable searchWord: '',
  @observable totalCount: 0,
  @observable currentPage: 1,

  appendQuery(params = {}, ret = false) {
    let searchVals = qs2Obj(location.search);
    if (!isEmpty(params)) {
      Object.assign(searchVals, params);
    }
    searchVals = omitBy(searchVals, str => str === '');

    const str = obj2Qs(searchVals);
    if (ret) {
      return str;
    }

    history.push(`?${str}`);
  },
  onChangeSelect(selectedRowKeys, selectedRows) {
    this.selectedRowKeys = selectedRowKeys;
    // todo
    this.selectIds = selectedRows.map(row => row[this.idKey]);
  },

  async onChangeStatus(nextStatus) {
    this.currentPage = 1;
    const status = this.selectStatus === nextStatus ? '' : nextStatus;
    this.selectStatus = status;
    // this.appendQuery({ status }); // todo: temporary remove
    await this.fetchAll();
  },

  async changePagination(page) {
    this.currentPage = page;
    this.appendQuery({ page });
    await this.fetchAll();
  },

  cancelSelected() {
    this.selectedRowKeys = [];
    this.selectIds = [];
  },

  async onSearch(word) {
    this.searchWord = word;
    this.currentPage = 1;
    await this.fetchAll();
  },

  async onClearSearch() {
    await this.onSearch('');
  },

  async onRefresh() {
    await this.fetchAll();
  },

  changeActiveType(activeType) {
    this.appendQuery({ activeType });
  },

  resetTableParams() {
    this.cancelSelected();
    this.selectStatus = '';
    this.searchWord = '';
    this.totalCount = 0;
    this.currentPage = 1;
  }
};
