import { observable, action } from 'mobx';
import _ from 'lodash';
import { useTableActions } from 'mixins';

import { PORTAL_NAME } from 'config/roles';
import { normalUserID, ISVID } from 'config/group';

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

  get sortRole() {
    return this.getStore('role').sortRole;
  }

  get roles() {
    return this.getStore('user').roles;
  }

  get modal() {
    return this.getStore('modal');
  }

  get userNames() {
    if (_.isEmpty(this.selectIds)) {
      return '';
    }

    const users = _.filter(this.users, user => this.selectIds.includes(user.user_id));
    return _.flatMap(users, 'username');
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

  get createRoles() {
    const { selectedGroupIds } = this.getStore('group');
    const key = _.first(selectedGroupIds);
    if (key === normalUserID) {
      return this.roles.filter(r => r.portal === PORTAL_NAME.user);
    }
    if (key === ISVID) {
      return this.roles.filter(r => r.portal === PORTAL_NAME.isv);
    }

    return this.roles
      .filter(r => r.portal === PORTAL_NAME.admin)
      .sort(this.sortRole);
  }

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

  @action
  setRole = async (e, data) => {
    this.operateResult = await this.request.post('user:role', {
      user_id: data.user_id.split(','),
      role_id: [data.role_id]
    });
    const { err } = this.operateResult;
    if (!err) {
      this.modal.hide();
      this.fetchAll();
    }
  };

  @action
  remove = async () => {
    const result = await this.request.delete('users', {
      user_id: this.userId
    });

    if (_.get(result, 'user_id')) {
      this.selectIds = [];
      this.selectedRowKeys = [];
      this.modal.hide();
      await this.fetchAll();
    } else {
      const { err, errDetail } = result;
      this.error(errDetail || err);
    }
  };
}
