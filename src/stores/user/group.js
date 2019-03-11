import { observable, action } from 'mobx';
import _ from 'lodash';
import { sleep } from 'utils';
import { useTableActions } from 'mixins';

import rootGroup, { platformUserID, normalUserID, ISVID } from 'config/group';

import Store from '../Store';

const defaultStatus = ['active'];

@useTableActions
export default class GroupStore extends Store {
  idKey = 'user_id';

  @observable isLoading = false;

  @observable users = [];

  @observable groupTreeData = [];

  @observable operateResult = null;

  @observable selectedGroupIds = [];

  @observable selectedJoinGroupIds = [];

  @observable setGroupTreeData = [];

  @observable groupName = '';

  get modal() {
    return this.getStore('modal');
  }

  get userStore() {
    return this.getStore('userDetail');
  }

  get fetchAllUser() {
    return this.getStore('userDetail').fetchAll;
  }

  get formatUserDetail() {
    return this.getStore('user').formatUserDetail;
  }

  get userSelectedIds() {
    return this.getStore('userDetail').selectIds;
  }

  get protectedGroupsIds() {
    return [platformUserID, normalUserID, ISVID];
  }

  get canCreateUser() {
    const key = _.first(this.selectedGroupIds);
    return key && key !== platformUserID;
  }

  get name() {
    const group = _.find(
      this.groups,
      g => g.group_id === _.first(this.selectedGroupIds)
    );
    return _.get(group, 'name');
  }

  get needJoinGroup() {
    const key = _.first(this.selectedGroupIds);
    const root = _.find(this.groups, g => !g.parent_group_id);

    return (
      key && !this.protectedGroupsIds.includes(key) && key !== root.group_id
    );
  }

  get selectedRoleId() {
    const key = _.first(this.selectedGroupIds);

    let role_id = '';
    if (!this.protectedGroupsIds.includes(key)) {
      return role_id;
    }

    if (key === platformUserID) {
      role_id = ['isv', 'user'];
    } else if (key === normalUserID) {
      role_id = 'user';
    } else {
      role_id = 'isv';
    }
    return role_id;
  }

  get validGroupIds() {
    const key = _.first(this.selectedGroupIds);
    if (this.protectedGroupsIds.includes(key)) {
      return [];
    }
    return this.selectedGroupIds;
  }

  get groupIdWithChildren() {
    const ids = [];
    const selectedId = _.first(this.validGroupIds);
    if (!selectedId) {
      return ids;
    }
    ids.push(selectedId);
    const addChildrenId = (dataSet, parentId) => {
      const data = _.filter(dataSet, g => g.parent_group_id === parentId);

      if (data.length === 0) {
        return;
      }
      _.forEach(data, group => {
        const id = group.group_id;
        ids.push(id);
        addChildrenId(dataSet, id);
      });
    };
    addChildrenId(this.groups, selectedId);

    return ids;
  }

  get rootGroup() {
    return _.find(this.groups, g => !g.parent_group_id);
  }

  @action
  reset = () => {
    this.isLoading = false;
    this.users = [];
    this.groupTreeData = [];
    this.operateResult = null;
    this.selectedGroupIds = [];
    this.groupName = '';
  };

  @action
  setDefaultGroupId = () => {
    const root = _.find(this.groups, g => !g.parent_group_id);
    if (_.isEmpty(this.selectedGroupIds)) {
      this.selectedGroupIds = [root.group_id];
    }
  };

  @action
  fetchUserDetail = (params = {}) => {
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
    return this.request.get(
      'users_detail',
      _.pickBy(_.assign(defaultParams, params), a => !_.isEmpty(a))
    );
  };

  @action
  fetchAll = async (params = {}) => {
    params.group_id = [];
    this.isLoading = true;
    const result = await this.fetchUserDetail(params);
    this.users = this.formatUserDetail(_.get(result, 'user_detail_set', []));
    this.totalCount = _.get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  fetchGroups = async () => {
    this.isLoading = true;
    const result = await this.request.get('groups', {
      status: defaultStatus
    });
    this.groups = _.get(result, 'group_set', []);
    this.getGroupTree();
    this.isLoading = false;
  };

  @action
  createGroup = async (e, data) => {
    this.operateResult = await this.request.post('groups', data);
    if (_.get(this.operateResult, 'group_id')) {
      this.modal.hide();
      await this.fetchGroups();
    }
  };

  @action
  deleteGroup = async (e, data) => {
    this.operateResult = await this.request.delete('groups', {
      group_id: [data.group_id]
    });
    if (_.get(this.operateResult, 'group_id')) {
      this.modal.hide();
      await this.fetchGroups();
    }
  };

  @action
  renameGroup = async (e, data) => {
    this.operateResult = await this.request.patch('groups', data);
    if (_.get(this.operateResult, 'group_id')) {
      this.groupName = data.name;
      this.modal.hide();
      await this.fetchGroups();
    }
  };

  @action
  joinGroup = async () => {
    const { item } = this.modal;
    const user_id = item.user_id ? [item.user_id] : this.userSelectedIds;

    const data = {
      group_id: this.selectedJoinGroupIds,
      user_id
    };
    this.operateResult = await this.request.post('groups:join', data);
    if (_.get(this.operateResult, 'group_id')) {
      this.selectedJoinGroupIds = [];
      this.selectedRowKeys = [];
      this.modal.hide();
      this.fetchAllUser();
    }
  };

  @action
  leaveGroup = async () => {
    let groupIds = _.flatMap(
      this.userStore.users.filter(user => this.userSelectedIds.includes(user.user_id)),
      'group_id'
    );
    groupIds = _.uniq(groupIds);
    await groupIds.forEach(async groupId => {
      const data = {
        group_id: [groupId],
        user_id: this.userSelectedIds
      };
      this.request.post('groups:leave', data);
    });

    this.userStore.selectIds = [];
    this.userStore.selectedRowKeys = [];
    this.modal.hide();
    await sleep(300);
    await this.fetchAllUser();
  };

  @action
  leaveGroupOnce = async user => {
    const data = {
      group_id: user.group_id,
      user_id: [user.user_id]
    };
    this.operateResult = await this.request.post('groups:leave', data);
    if (_.get(this.operateResult, 'group_id')) {
      this.userStore.selectIds = [];
      this.userStore.selectedRowKeys = [];
      this.modal.hide();
      this.fetchAllUser();
    }
  };

  @action
  onSelectOrg = keys => {
    if (_.isEmpty(keys)) {
      return null;
    }

    this.selectedGroupIds = keys;
    this.selectJoinGroupIds = keys;
    this.selectedRowKeys = [];
    _.assign(this.userStore, {
      selectIds: [],
      selectedRowKeys: []
    });
    this.groupName = this.name;
    this.fetchAllUser();
  };

  @action
  onSelectJoinGroupOrg = keys => {
    if (_.isEmpty(keys)) {
      return null;
    }
    this.selectedJoinGroupIds = keys;
  };

  @action
  getGroupTree = () => {
    const { groups } = this;
    if (groups.length === 0) {
      return [];
    }

    const root = _.find(groups, g => !g.parent_group_id);
    if (_.isEmpty(root)) {
      throw new Error('No root group');
    }
    const data = [...rootGroup];
    const filter = (dataSet, parentId) => _.filter(dataSet, g => g.parent_group_id === parentId);
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

    Object.assign(data[0], {
      group_id: root.group_id,
      key: root.group_id
    });
    data[0].children = setChildren(groups, root);

    this.groupTreeData = data;
    this.joinGroupTreeData = [data[0]];
    this.setDefaultGroupId();
  };
}
