import { observable, action } from 'mobx';
import _ from 'lodash';

import { getFormData } from 'utils';
import { useTableActions } from 'mixins';
import { PORTAL_NAME } from 'config/roles';

import { rootName, normalUserName, ISVName } from 'config/group';
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

  @observable
  userDetail = {
    user_id: '',
    username: '',
    email: '',
    password: '',
    role_id: '',
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

  get userDetailStore() {
    return this.getStore('userDetail');
  }

  get groups() {
    return this.getStore('group').groups;
  }

  get groupName() {
    return this.getStore('group').groupName;
  }

  get needJoinGroup() {
    return this.getStore('group').needJoinGroup;
  }

  get sortRole() {
    return this.getStore('role').sortRole;
  }

  get selectedGroupIds() {
    return this.getStore('group').validGroupIds;
  }

  get selectedRoleId() {
    return this.getStore('group').selectedRoleId;
  }

  get userNames() {
    if (_.isEmpty(this.selectIds)) {
      return '';
    }

    const users = _.filter(this.users, user => this.selectIds.includes(user.user_id));
    return _.flatMap(users, 'username');
  }

  get isvRoles() {
    return this.roles
      .filter(r => r.portal === 'isv' && r.role_id !== 'isv')
      .sort(this.sortRole);
  }

  get fetchDetailStore() {
    return this.getStore('userDetail').fetchAll;
  }

  @action
  formatUserDetail = arr => {
    arr = _.map(
      arr,
      item => {
        const user = item.user;
        const role = _.get(item, 'role_set[0]');
        user.role = role;
        if (role && (role.portal === 'isv' || role.portal === 'user')) {
          user.groupName = role.portal === 'user' ? normalUserName : ISVName;
          return user;
        }
        const group = _.get(item, 'group_set[0]');
        if (!group) {
          return user;
        }
        const groupName = group.name;
        Object.assign(user, {
          group_id: group.group_id,
          groupName: groupName === 'root' ? rootName : groupName
        });
        return user;
      },
      []
    );
    return arr;
  };

  @action
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
      _.pickBy(
        _.assign(defaultParams, params),
        a => !_.isArray(a) || !_.isEmpty(a)
      )
    );
  };

  @action
  fetchAll = async (params = {}) => {
    this.selectedIds = [];
    this.selectedRowKeys = [];
    this.isLoading = true;
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
    const result = await this.request.get(
      'users',
      _.pickBy(
        _.assign(defaultParams, params),
        a => !_.isArray(a) || !_.isEmpty(a)
      )
    );
    this.users = _.get(result, 'user_set', []);
    this.totalCount = _.get(result, 'total_count', 0);
    this.isLoading = false;
  };

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
    const result = await this.request.get(`users_detail`, { user_id: userId });
    const detailRes = _.get(result, 'user_detail_set[0]');
    this.userDetail = _.get(detailRes, 'user', {});

    if (isLogin) {
      const role = _.get(detailRes, 'role_set[0]', {});
      const { role_id, portal } = role;
      const portalName = portal === PORTAL_NAME.isv && role_id !== PORTAL_NAME.isv
        ? PORTAL_NAME.dev
        : portal;
      this.updateUser(
        _.extend(_.pick(this.userDetail, ['user_id', 'username', 'email']), {
          role: role_id,
          portal: portalName || PORTAL_NAME.user
        })
      );
    }

    this.isLoading = false;
  };

  @action
  createOrModify = async (e, data, isIsv = false) => {
    const params = _.pick({ ...data }, [
      'user_id',
      'username',
      'email',
      'password',
      'role_id',
      'description'
    ]);

    if (!params.email) {
      return this.error('Empty email');
    }
    if (params.user_id) {
      if (!params.password) {
        delete params.password;
      }
      await this.modify(params);
    } else {
      if (!params.role_id) {
        return this.error('Empty role');
      }
      if (!params.password) {
        return this.error('Empty password');
      }

      // fixme
      // delete params.username;
      await this.create(params, isIsv);
      const userId = _.get(this.operateResult, 'user_id');
      if (!!userId && this.needJoinGroup) {
        this.userDetailStore.selectIds = [userId];
        await this.groupStore.joinGroup();
      }
    }

    if (_.get(this.operateResult, 'user_id')) {
      this.modal.hide();
      this.userDetail = {};
      await this.fetchDetailStore();
    }
  };

  hideModifyUser = () => {
    this.userDetail = {};
    this.modal.hide();
  };

  @action
  create = async (params = {}, isIsv) => {
    this.isLoading = true;
    const url = !isIsv ? 'users' : 'isv_users';
    this.operateResult = await this.request.post(url, params);
    this.isLoading = false;
  };

  @action createIsvUser = () => {};

  @action
  modify = async (params = {}) => {
    this.isLoading = true;
    const result = await this.request.patch('users', params);
    this.isLoading = false;
    this.operateResult = result;
    return result;
  };

  @action
  changePwd = async (e, data) => {
    const result = await this.changePassword(data);
    if (_.get(result, 'user_id')) {
      this.success('Change password successful');
      this.modal.hide();
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

  @action
  fetchRoles = async (params = {}) => {
    const result = await this.request.get(
      'roles',
      _.assign(
        {
          status: 'active'
        },
        params
      )
    );
    this.roles = _.get(result, 'role_set', []);
    this.roles.slice().sort(this.sortRole);
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
  modifyUser = async data => {
    data.user_id = this.userDetail.user_id;
    const result = await this.modify(_.omit(data, 'language'));

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
}

export Role from './role';

export Group from './group';

export Detail from './detail';
