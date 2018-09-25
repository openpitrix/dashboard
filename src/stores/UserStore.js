import { observable, action } from 'mobx';
import { get, pick, assign } from 'lodash';
import Store from './Store';
import { setCookie, getUrlParam } from 'utils';
const defaultStatus = ['active'];

export default class UserStore extends Store {
  @observable users = [];
  @observable groups = [];
  @observable roles = [];
  @observable authorities = [];
  @observable currentTag = '';
  @observable isLoading = false;

  @observable currentPage = 1; //user table query params
  @observable searchWord = '';
  @observable selectStatus = '';
  @observable totalCount = 0;

  @observable selectGroupId = '';
  @observable selectRoleId = '';
  @observable selectName = 'Administrator';

  @observable selectValue = 'roles';
  @observable showAuthorityModal = false;
  @observable treeFlag = false;
  @observable organizations = [];

  @observable summaryInfo = {};

  @observable operateType = '';
  @observable isCreateOpen = false;
  @observable isDeleteOpen = false;

  @observable
  userDetail = {
    username: '',
    email: '',
    password: '',
    role: 'user',
    description: ''
  };
  @observable userId = '';
  @observable operateResult = null;

  @action
  fetchAll = async (params = {}) => {
    let defaultParams = {
      sort_key: 'status_time',
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
      status: this.selectStatus ? this.selectStatus : defaultStatus
    };

    if (this.searchWord) {
      defaultParams.search_word = this.searchWord;
    }
    if (this.selectRoleId) {
      defaultParams.role = this.selectRoleId;
    }

    this.isLoading = true;
    const result = await this.request.get('users', assign(defaultParams, params));
    this.users = get(result, 'user_set', []);
    this.totalCount = get(result, 'total_count', 0);

    const user = this.users && this.users[0];
    if (params.isLogin && user.user_id) {
      setCookie('user', user.username);
      setCookie('role', user.role);
      setCookie('last_login', Date.now());
    }
    this.isLoading = false;
  };

  @action
  fetchStatistics = async () => {
    //this.isLoading = true;
    const result = await this.request.get('users/statistics');
    this.summaryInfo = {
      name: 'Users',
      iconName: 'group',
      centerName: 'Roles',
      total: get(result, 'app_count', 0),
      progressTotal: get(result, 'repo_count', 0),
      progress: get(result, 'top_ten_repos', {}),
      histograms: get(result, 'last_two_week_created', {})
    };
    //this.isLoading = false;
  };

  @action
  fetchDetail = async userId => {
    this.isLoading = true;
    const result = await this.request.get(`users`, { user_id: userId });
    this.userDetail = get(result, 'user_set[0]', {});
    this.isLoading = false;
  };

  @action
  createOrModify = async () => {
    const params = pick({ ...this.userDetail }, [
      'user_id',
      'username',
      'email',
      'password',
      'role',
      'description'
    ]);

    if (params.user_id) {
      if (!params.password) {
        delete params.password;
      }
      await this.modify(params);
    } else {
      delete params.username;
      await this.create(params);
    }

    if (get(this.operateResult, 'user_id')) {
      this.hideModal();
      await this.fetchAll();
    } else {
      const { err, errDetail } = this.operateResult;
      this.error(errDetail || err);
    }
  };

  @action
  create = async (params = {}) => {
    this.isLoading = true;
    this.operateResult = await this.request.post('users', params);
    this.isLoading = false;
  };

  @action
  modify = async (params = {}) => {
    this.isLoading = true;
    this.operateResult = await this.request.patch('users', params);
    this.isLoading = false;
  };

  @action
  remove = async () => {
    const result = await this.request.delete('users', { user_id: [this.userId] });

    if (get(result, 'user_id')) {
      this.hideModal();
      await this.fetchAll();
    } else {
      const { err, errDetail } = result;
      this.error(errDetail || err);
    }
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
  oauth2Check = async params => {
    const data = {
      grant_type: 'password',
      scope: '',
      username: params.email,
      password: params.password
    };

    const result = await this.request.post('oauth2/token', data);
    const { access_token, token_type, expires_in, refresh_token } = result;
    if (access_token) {
      const time = expires_in * 1000;
      setCookie('access_token', access_token, time);
      setCookie('token_type', token_type, time);
      setCookie('refresh_token', refresh_token);
      //get login user info
      await this.fetchAll({ search_word: params.email, isLogin: true });
      const url = getUrlParam('url');
      location.href = url ? url : '/dashboard';
    } else {
      const { err, errDetail } = result;
      this.error(errDetail || err);
    }
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
  showCreateUser = () => {
    this.operateType = 'create';
    this.isCreateOpen = true;
    this.userDetail = {
      username: '',
      email: '',
      password: '',
      role: 'user',
      description: ''
    };
  };

  @action
  showModifyUser = user => {
    this.operateType = 'modify';
    this.isCreateOpen = true;
    this.userDetail = user;
    this.userDetail.password = '';
  };

  @action
  showDeleteUser = userId => {
    this.userId = userId;
    this.isDeleteOpen = true;
  };

  @action
  hideModal = () => {
    this.isCreateOpen = false;
    this.isDeleteOpen = false;
  };

  @action
  changeUser = (event, type) => {
    this.userDetail[type] = event.target.value;
  };

  @action
  changeUserRole = role => {
    this.userDetail.role = role;
  };

  @action
  loadPageInit = () => {
    this.currentPage = 1;
    this.selectStatus = '';
    this.searchWord = '';
    this.userDetail = {
      username: '',
      email: '',
      password: '',
      role: 'user',
      description: ''
    };
  };
}
