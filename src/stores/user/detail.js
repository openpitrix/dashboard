import { observable } from 'mobx';
import _ from 'lodash';
import { useTableActions } from 'mixins';

import Store from '../Store';

const defaultStatus = ['active'];

@useTableActions
export default class UserDetailStore extends Store {
  idKey = 'user_id';

  @observable isLoading = false;

  @observable users = [];

  get formatUserDetail() {
    return this.getStore('user').formatUserDetail;
  }

  get selectedGroupIds() {
    return this.getStore('group').validGroupIds;
  }

  get selectedRoleId() {
    return this.getStore('group').selectedRoleId;
  }

  fetchUserDetail = (params = {}) => {
    const defaultParams = {
      sort_key: 'status_time',
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
      status: this.selectStatus ? this.selectStatus : defaultStatus,
      root_group_id: this.selectedGroupIds,
      role_id: this.selectedRoleId
    };
    if (params.noLimit) {
      defaultParams.limit = this.maxLimit;
      defaultParams.offset = 0;
      delete params.noLimit;
    }
    if (this.searchWord) {
      defaultParams.search_word = this.searchWord;
    }
    return this.request.get(
      'users_detail',
      _.pickBy(_.assign(defaultParams, params), a => !_.isEmpty(a))
    );
  };

  fetchAll = async (params = {}) => {
    this.selectedIds = [];
    this.selectedRowKeys = [];
    this.isLoading = true;
    const result = await this.fetchUserDetail(params);
    this.users = this.formatUserDetail(_.get(result, 'user_detail_set', []));
    this.totalCount = _.get(result, 'total_count', 0);
    this.isLoading = false;
  };

  reset = () => {
    this.users = [];
    this.currentPage = 1;
    this.selectStatus = '';
    this.searchWord = '';
  };
}
