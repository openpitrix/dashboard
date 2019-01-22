import { observable, action } from 'mobx';
import _, { get, pick, assign } from 'lodash';

import { getFormData } from 'utils';

import Store from '../Store';

import dataGroup from './data_json';

const defaultStatus = ['active'];

export default class UserStore extends Store {
  @observable users = [];

  @observable groups = [];

  @observable roles = [];

  @observable authorities = [];

  @observable currentTag = '';

  @observable isLoading = false;

  @observable currentPage = 1;

  // user table query params
  @observable searchWord = '';

  @observable selectStatus = '';

  @observable totalCount = 0;

  @observable selectGroupId = '';

  @observable selectRoleId = '';

  @observable selectName = '';

  @observable selectValue = 'roles';

  @observable showAuthorityModal = false;

  @observable treeFlag = false;

  @observable organizations = [];

  @observable summaryInfo = {};

  @observable operateType = '';

  @observable isCreateOpen = false;

  @observable isDeleteOpen = false;

  @observable cookieTime = 2 * 60 * 60 * 1000;

  @observable rememberMe = false;

  @observable selectedRowKeys = [];

  @observable userIds = [];

  @observable userNames = [];

  @observable orgName = '';

  @observable language = localStorage.getItem('i18nextLng') || 'zh';

  @observable groupTreeData = [];

  @observable selectOrgKeys = [];

  @observable
  userDetail = {
    user_id: '',
    username: '',
    email: '',
    password: '',
    role: '',
    description: ''
  };

  @observable userId = '';

  @observable operateResult = null;

  @action
  fetchAll = async (params = {}) => {
    const defaultParams = {
      sort_key: 'status_time',
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
      status: this.selectStatus ? this.selectStatus : defaultStatus
    };

    if (params.noLimit) {
      defaultParams.limit = this.maxLimit;
      defaultParams.offset = 0;
      delete params.noLimit;
    }

    if (this.searchWord) {
      defaultParams.search_word = this.searchWord;
    }
    if (this.selectRoleId) {
      defaultParams.role = [this.selectRoleId];
    }

    this.isLoading = true;
    const result = await this.request.get(
      'users',
      assign(defaultParams, params)
    );
    this.users = get(result, 'user_set', []);
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  fetchStatistics = async () => {
    // this.isLoading = true;
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
    // this.isLoading = false;
  };

  @action
  fetchDetail = async (userId, isLogin) => {
    this.isLoading = true;
    const result = await this.request.get(`users`, { user_id: userId });
    this.userDetail = get(result, 'user_set[0]', {});

    if (isLogin) {
      this.updateUser(
        pick(this.userDetail, ['user_id', 'username', 'email', 'role'])
      );
    }

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

    if (!params.email) {
      return this.error('Empty email');
    }
    if (!params.role) {
      return this.error('Empty role');
    }

    if (params.user_id) {
      // modify user
      if (!params.password) {
        delete params.password;
      }
      await this.modify(params);
    } else {
      // create user
      if (!params.password) {
        return this.error('Empty password');
      }

      // fixme
      delete params.username;
      await this.create(params);
    }

    if (get(this.operateResult, 'user_id')) {
      this.hideModal();
      await this.fetchAll();
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
    const result = await this.request.patch('users', params);
    this.isLoading = false;
    this.operateResult = result;
    return result;
  };

  @action
  remove = async () => {
    const result = await this.request.delete('users', {
      user_id: [this.userId]
    });

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
    this.groups = get(dataGroup, 'op_group_set', []);
    // this.groups = get(result, 'group_set', []);
    this.isLoading = false;
  };

  @action
  fetchRoles = async () => {
    this.isLoading = true;
    // const result = await this.request.get('iam/roles');
    // this.roles = get(result, 'role_set', []);
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
  oauth2Check = async (params = {}) => await this.request.post('oauth2/token', {
    grant_type: 'password',
    scope: '',
    username: params.email,
    password: params.password
  });

  @action
  modifyUser = async e => {
    e.preventDefault();

    const data = getFormData(e.target);
    data.user_id = this.userDetail.user_id;
    const result = await this.modify(data);

    if (get(result, 'user_id')) {
      this.success('Modify user successful');
      return { username: data.username };
    }
  };

  @action
  modifyPassword = async e => {
    e.preventDefault();

    const data = getFormData(e.target);
    if (data.new_password !== data.confirm_password) {
      this.error('New password is different entered twice');
      return;
    }

    const resetResult = await this.resetPassword({
      user_id: this.userDetail.user_id,
      password: data.password
    });

    const resetId = get(resetResult, 'reset_id');
    if (resetId) {
      const result = await this.changePassword({
        new_password: data.new_password,
        reset_id: resetId
      });

      if (get(result, 'user_id')) {
        this.success('Change password successful');
      }
    }
  };

  @action
  resetPassword = async (params = {}) => await this.request.post('users/password:reset', params);

  @action
  changePassword = async (params = {}) => await this.request.post('users/password:change', params);

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
      role: '',
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
  showSetRole = user => {
    if (user) {
      this.userIds.push(user.user_id);
      this.userNames.push(user.username);
    }
    this.operateType = 'set_role';
    this.isCreateOpen = true;
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
  changeLanguage = lan => {
    this.language = lan;
  };

  @action
  toggleRememberMe = () => {
    this.rememberMe = !this.rememberMe;
  };

  @action
  reset = () => {
    this.currentPage = 1;
    this.selectStatus = '';
    this.searchWord = '';
    this.selectRoleId = '';
    this.userDetail = {
      username: '',
      email: '',
      password: '',
      role: '',
      description: ''
    };
  };

  @action
  onChangeSelect = (selectedRowKeys, selectedRows) => {
    this.selectedRowKeys = selectedRowKeys;
    this.userIds = selectedRows.map(row => row.user_id);
    this.userNames = selectedRows.map(row => row.username);
  };

  @action
  onSelectOrg = (keys, info) => {
    this.selectOrgKeys = keys;
    this.orgName = keys.length ? get(info, 'node.props.title') : '';
    this.fetchAll();
  };

  @action
  setUserDisable = user_id => {
    this.modify({ status: 'draft', user_id });
  };

  getGroupTree = () => {
    const { groups } = this;
    if (groups.length === 0) {
      return [];
    }

    const root = _.find(groups, g => !g.parent_group_id);
    if (_.isEmpty(root)) {
      throw new Error('No root group');
    }
    const data = [
      {
        group_id: root.group_id,
        key: root.group_id,
        title: root.group_name
      }
    ];
    const filter = (dataSet, parent_group_id) => _.filter(dataSet, g => g.parent_group_id === parent_group_id).sort(
      (a, b) => a.seq_order - b.seq_order
    );
    const setChildren = (dataSet, treeDataNode) => {
      const children = filter(dataSet, treeDataNode.group_id);
      if (children.length === 0) {
        return [];
      }
      return children.map(node => ({
        key: node.group_id,
        title: node.group_name,
        children: setChildren(dataSet, node)
      }));
    };

    data[0].children = setChildren(groups, data[0]);
    this.groupTreeData = data;
  };
}

export Role from './role';
