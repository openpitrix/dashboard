import { observable } from 'mobx';
import qs from 'query-string';
import { isEmpty } from 'lodash';

import history from 'createHistory';

export default {
  @observable selectedRowKeys: [],
  @observable selectIds: [],
  @observable selectStatus: '',
  @observable searchWord: '',
  @observable totalCount: 0,
  @observable currentPage: 1,

  appendQuery(params = {}, ret = false) {
    const searchVals = qs.parse(location.search);
    if (!isEmpty(params)) {
      Object.assign(searchVals, params);
    }

    const str = qs.stringify(searchVals);
    if (ret) {
      return str;
    }

    history.push(`?${str}`);
  },

  onChangeSelect(selectedRowKeys, selectedRows) {
    this.selectedRowKeys = selectedRowKeys;
    // todo
    this.selectIds = selectedRows.map(row => row.app_id);
  },

  async onChangeStatus(status) {
    this.currentPage = 1;
    this.selectStatus = this.selectStatus === status ? '' : status;
    this.appendQuery({ status });
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

  resetTableParams() {
    this.cancelSelected();
    this.selectStatus = '';
    this.searchWord = '';
    this.totalCount = 0;
    this.currentPage = 1;
  }
};
