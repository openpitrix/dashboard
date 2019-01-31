import { observable, action } from 'mobx';
import _ from 'lodash';

import { getFormData } from 'utils';
import { useTableActions } from 'mixins';

import Store from '../Store';

const defaultStatus = ['active'];

@useTableActions
export default class UserStore extends Store {
  idKey = 'user_id';

  @observable users = [];

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

  @observable language = localStorage.getItem('i18nextLng') || 'zh';

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

  get modal() {
    return this.getStore('modal');
  }

  get groupStore() {
    return this.getStore('group');
  }

  get selectedGroupIds() {
    return this.getStore('group').selectedGroupIds;
  }

  get groups() {
    return this.getStore('group').groups;
  }

  get groupName() {
    return this.getStore('group').groupName;
  }

  get userNames() {
    if (_.isEmpty(this.selectIds)) {
      return '';
    }

    const users = _.filter(this.users, user => this.selectIds.includes(user.user_id));
    return _.flatMap(users, 'username');
  }

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
      _.assign(defaultParams, params)
    );
    this.users = _.get(result, 'user_set', []);
    this.setUserGroupName();
    this.totalCount = _.get(result, 'total_count', 0);
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
      total: _.get(result, 'app_count', 0),
      progressTotal: _.get(result, 'repo_count', 0),
      progress: _.get(result, 'top_ten_repos', {}),
      histograms: _.get(result, 'last_two_week_created', {})
    };
  };

  @action
  fetchDetail = async (userId, isLogin) => {
    this.isLoading = true;
    const result = await this.request.get(`users`, { user_id: userId });
    this.userDetail = _.get(result, 'user_set[0]', {});

    if (isLogin) {
      this.updateUser(
        _.pick(this.userDetail, ['user_id', 'username', 'email', 'role'])
      );
    }

    this.isLoading = false;
  };

  @action
  createOrModify = async (e, data) => {
    const params = _.pick({ ...data }, [
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
      const userId = _.get(this.operateResult, 'user_id');
      if (!_.isEmpty(this.selectedGroupIds) && !!userId) {
        this.groupStore.selectIds = [userId];
        await this.groupStore.joinGroup();
      }
    }

    if (_.get(this.operateResult, 'user_id')) {
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

  @action
  fetchRoles = async () => {
    const result = await this.request.get('roles');
    this.roles = _.get(result, 'value', []);
  };

  @action
  fetchAuthorities = async () => {
    this.isLoading = true;
    const result = await this.request.get('authorities');
    this.authorities = _.get(result, 'authority_set', []);
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

    if (_.get(result, 'user_id')) {
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

    const resetId = _.get(resetResult, 'reset_id');
    if (resetId) {
      const result = await this.changePassword({
        new_password: data.new_password,
        reset_id: resetId
      });

      if (_.get(result, 'user_id')) {
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
  setRole = async (e, data) => {
    this.operateResult = await this.request.post('user:role', {
      user_id: data.user_id.split(','),
      role_id: [data.role_id]
    });
    const { err } = this.operateResult;
    if (!err) {
      this.modal.hide();
      this.selectedIds = [];
      this.selectedRowKeys = [];
      this.fetchAll();
    }
  };
}

export Role from './role';

export Group from './group';
