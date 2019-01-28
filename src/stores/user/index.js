import { observable, action } from 'mobx';
import _, { get, pick, assign } from 'lodash';

import { getFormData } from 'utils';
import { useTableActions } from 'mixins';

import Store from '../Store';

const defaultStatus = ['active'];

@useTableActions
export default class UserStore extends Store {
  idKey = 'user_id';

  @observable users = [];

  @observable groups = [];

  @observable roles = [];

  @observable authorities = [];

  @observable currentTag = '';

  @observable isLoading = false;

  @observable currentPage = 1;

  @observable selectRoleId = '';

  @observable selectName = '';

  @observable selectValue = 'roles';

  @observable showAuthorityModal = false;

  @observable treeFlag = false;

  @observable summaryInfo = {};

  @observable operateType = '';

  @observable cookieTime = 2 * 60 * 60 * 1000;

  @observable rememberMe = false;

  @observable userNames = [];

  @observable language = localStorage.getItem('i18nextLng') || 'zh';

  @observable groupTreeData = [];

  @observable groupName = '';

  @observable selectedGroupIds = [];

  @observable noGroupUsers = [];

  get modal() {
    return this.getStore('modal');
  }

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
      status: this.selectStatus ? this.selectStatus : defaultStatus,
      group_id: this.selectedGroupIds
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
    this.setUserGroupName();
    this.totalCount = get(result, 'total_count', 0);
    this.isLoading = false;
  };

  setUserGroupName() {
    this.users.forEach(user => {
      if (!(_.isArray(user.group_id) && user.group_id.length > 0)) {
        return;
      }
      const groups = _.filter(this.groups, g => user.group_id.includes(g.group_id));
      user.groupName = _.flatMap(groups, 'name').join(',');
    });
  }

  @action
  fetchStatistics = async () => {
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
  fetchNoGroupUser = async () => {
    const result = await this.request.get('users');
    const users = get(result, 'user_set', []);
    this.noGroupUsers = users.filter(
      u => !(_.isArray(u.group_id) && u.group_id.length > 0)
    );
  };

  @action
  createOrModify = async (e, data) => {
    const params = pick({ ...data }, [
      'user_id',
      'username',
      'email',
      'password',
      'role',
      'description'
    ]);
    console.log(params);

    if (!params.email) {
      return this.error('Empty email');
    }
    if (!params.role) {
      return this.error('Empty role');
    }

    if (params.user_id) {
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
      // delete params.username;
      await this.create(params);
    }

    if (get(this.operateResult, 'user_id')) {
      this.modal.hide();
      this.userDetail = {};
      await this.fetchAll();
    }
  };

  @action
  showModifyUser = user => {
    this.userDetail = user;
    this.userDetail.password = '';
    this.modal.show('renderModalCreateUser');
  };

  hideModifyUser = () => {
    this.userDetail = {};
    this.modal.hide();
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
      this.modal.hide();
      await this.fetchAll();
    } else {
      const { err, errDetail } = result;
      this.error(errDetail || err);
    }
  };

  @action
  fetchGroups = async () => {
    this.isLoading = true;
    const result = await this.request.get('groups');
    this.groups = get(result, 'group_set', []);
    this.getGroupTree();
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
  onSelectOrg = (keys, info) => {
    this.selectedGroupIds = keys;
    this.selectedRowKeys = [];
    this.groupName = keys.length ? get(info, 'node.props.title') : '';
    this.fetchAll();
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
        title: root.name
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
        title: node.name,
        children: setChildren(dataSet, node)
      }));
    };

    data[0].children = setChildren(groups, data[0]);
    this.groupTreeData = data;
  };

  @action
  createGroup = async (e, data) => {
    this.operateResult = await this.request.post('groups', data);
    if (get(this.operateResult, 'group_id')) {
      this.modal.hide();
      await this.fetchGroups();
    }
  };

  @action
  deleteGroup = async (e, data) => {
    this.operateResult = await this.request.delete('groups', {
      group_id: [data.group_id]
    });
    if (get(this.operateResult, 'group_id')) {
      this.modal.hide();
      await this.fetchGroups();
    }
  };

  @action
  renameGroup = async (e, data) => {
    this.operateResult = await this.request.patch('groups', data);
    if (get(this.operateResult, 'group_id')) {
      this.groupName = data.name;
      this.modal.hide();
      await this.fetchGroups();
    }
  };

  @action
  joinGroup = async () => {
    const data = {
      group_id: this.selectedGroupIds,
      user_id: this.selectIds
    };
    this.operateResult = await this.request.post('groups:join', data);
    if (get(this.operateResult, 'group_id')) {
      this.selectIds = [];
      this.selectedRowKeys = [];
      this.modal.hide();
      this.fetchAll();
    }
  };

  @action
  leaveGroup = async () => {
    let groupIds = _.flatMap(
      this.users.filter(user => this.selectIds.includes(user.user_id)),
      'group_id'
    );
    groupIds = _.uniq(groupIds);
    groupIds.forEach(async groupId => {
      const data = {
        group_id: [groupId],
        user_id: this.selectIds
      };
      await this.request.post('groups:leave', data);
    });

    this.selectIds = [];
    this.selectedRowKeys = [];
    this.modal.hide();
    await this.fetchAll();
  };

  @action
  leaveGroupOnce = async user => {
    const data = {
      group_id: user.group_id,
      user_id: [user.user_id]
    };
    this.operateResult = await this.request.post('groups:leave', data);
    if (get(this.operateResult, 'group_id')) {
      this.selectIds = [];
      this.selectedRowKeys = [];
      this.modal.hide();
      this.fetchAll();
    }
  };
}

export Role from './role';
