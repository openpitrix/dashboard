import { observable, action } from 'mobx';
import { get, assign } from 'lodash';
import Store from './Store';

export default class UserStore extends Store {
  @observable users = [];
  @observable userDetail = {};
  @observable isLoading = false;
  @observable totalCount = 0;
  @observable organizations = [];
  @observable groups = [];
  @observable roles = [];
  @observable authorities = [];
  @observable currentTag = '';

  @observable currentPage = 1; //user table query params
  @observable searchWord = '';
  @observable defaultStatus = ['active'];
  @observable selectStatus = '';

  @action
  fetchAll = async (params = {}) => {
    let defaultParams = {
      sort_key: 'status_time',
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
      status: this.selectStatus ? this.selectStatus : this.defaultStatus
    };

    if (this.searchWord) {
      defaultParams.search_word = this.searchWord;
    }

    this.isLoading = true;
    const result = await this.request.get('users', assign(defaultParams, params));
    this.users = get(result, 'user_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  fetchUsersDetail = async userId => {
    this.isLoading = true;
    const result = await this.request.get(`users`, { user_id: userId });
    this.userDetail = get(result, 'app_set[0]', {});
    this.isLoading = false;
  };

  @action
  fetchOrganizations = async () => {
    this.isLoading = true;
    const result = await this.request.get('organizations');
    this.organizations = get(result, 'organization_set', []);
    this.isLoading = false;
  };

  @action
  fetchGroups = async () => {
    this.isLoading = true;
    const result = await this.request.get('groups');
    this.groups = get(result, 'group_set', []);
    this.isLoading = false;
  };

  @action
  fetchRoles = async () => {
    this.isLoading = true;
    const result = await this.request.get('roles');
    this.roles = get(result, 'role_set', []);
    this.isLoading = false;
  };

  @action
  fetchAuthorities = async () => {
    this.isLoading = true;
    const result = await this.request.get('authorities');
    this.authorities = get(result, 'authority_set', []);
    this.isLoading = false;
  };

  @action
  onSearch = async word => {
    this.searchWord = word;
    this.currentPage = 1;
    await this.fetchAll();
  };

  @action
  onClearSearch = async () => {
    await this.onSearch('');
  };

  @action
  onRefresh = async () => {
    await this.fetchAll();
  };

  @action
  changePagination = async page => {
    this.currentPage = page;
    await this.fetchAll();
  };

  @action
  onChangeStatus = async status => {
    this.currentPage = 1;
    this.selectStatus = this.selectStatus === status ? '' : status;
    await this.fetchAll();
  };

  @action
  loadPageInit = () => {
    this.currentPage = 1;
    this.selectStatus = '';
    this.searchWord = '';
  };
}
