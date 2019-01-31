import { observable, action } from 'mobx';
import _ from 'lodash';
import { sleep } from 'utils';
import { useTableActions } from 'mixins';

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

  @observable groupName = '';

  get modal() {
    return this.getStore('modal');
  }

  get userStore() {
    return this.getStore('user');
  }

  get fetchUser() {
    return this.getStore('user').fetchAll;
  }

  get userSelectedIds() {
    return this.getStore('user').selectIds;
  }

  @action
  fetchAll = async (params = {}) => {
    const defaultParams = {
      sort_key: 'status_time',
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
      status: this.selectStatus ? this.selectStatus : defaultStatus
    };

    if (this.searchWord) {
      defaultParams.search_word = this.searchWord;
    }

    const result = await this.request.get(
      'users',
      _.assign(defaultParams, params)
    );
    const users = _.get(result, 'user_set', []);
    this.users = users.filter(
      u => !(_.isArray(u.group_id) && u.group_id.length > 0)
    );
    this.totalCount = _.get(result, 'total_count', 0);
    this.isLoading = false;
  };

  @action
  fetchGroups = async () => {
    this.isLoading = true;
    const result = await this.request.get('groups');
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
    const data = {
      group_id: this.selectedGroupIds,
      user_id: this.selectIds
    };
    this.operateResult = await this.request.post('groups:join', data);
    if (_.get(this.operateResult, 'group_id')) {
      this.selectIds = [];
      this.selectedRowKeys = [];
      this.modal.hide();
      this.fetchUser();
    }
  };

  @action
  leaveGroup = async () => {
    let groupIds = _.flatMap(
      this.userStore.users.filter(user => this.userSelectedIds.includes(user.user_id)),
      'group_id'
    );
    groupIds = _.uniq(groupIds);
    groupIds.forEach(async groupId => {
      const data = {
        group_id: [groupId],
        user_id: this.userSelectedIds
      };
      await this.request.post('groups:leave', data);
    });

    this.userStore.selectIds = [];
    this.userStore.selectedRowKeys = [];
    this.modal.hide();
    await sleep(300);
    await this.fetchUser();
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
      this.fetchUser();
    }
  };

  @action
  onSelectOrg = (keys, info) => {
    this.selectedGroupIds = keys;
    this.selectedRowKeys = [];
    this.groupName = keys.length ? _.get(info, 'node.props.title') : '';
    this.fetchUser();
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
    const data = [
      {
        group_id: root.group_id,
        key: root.group_id,
        title: root.name
      }
    ];
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

    data[0].children = setChildren(groups, data[0]);
    this.groupTreeData = data;
  };
}
