import { observable, action } from 'mobx';
import _ from 'lodash';
import Store from '../Store';

const KeyFeatureAll = 'all';
const KeyCreateRoll = 'add';
const TypeFeature = 'feature';
const TypeModule = 'module';

export default class RoleStoreStore extends Store {
  @observable roles = [];

  @observable roleDetail = {};

  @observable selectedRole = {};

  @observable selectedFeatureModule = {};

  @observable isLoading = true;

  @observable bingActions = [];

  @observable isModalOpen = false;

  @observable modalType = '';

  modules = [];

  features = [];

  actions = [];

  @action
  async fetchAll() {
    this.isLoading = true;
    this.roles = [
      {
        role_id: 'admin',
        role_name: '超级管理员',
        description: '最高权限管理员，不可删除和修改',
        portal: 'admin'
      },
      {
        role_id: 'isv',
        role_name: '应用服务商',
        description: '应用服务商中心',
        portal: 'isv'
      },
      {
        role_id: 'normal',
        role_name: '普通用户',
        description: '应用中心',
        portal: 'normal'
      }
    ];
    this.isLoading = false;
  }

  @action
  async fetchRoleDetail(repoId) {
    this.isLoading = true;
    const result = await this.request.get(`roles/${repoId}`);
    this.roleDetail = _.get(result, 'role_set[0]', {});
    this.isLoading = false;
  }

  @action
  async fetchAllModules() {
    this.modules = [
      {
        module_id: 'mod-1',
        module_name: '商店管理'
      },
      {
        module_id: 'mod-2',
        module_name: '应用服务商管理'
      }
    ];
  }

  @action
  async fetchAllFeatures() {
    this.features = [
      {
        feature_id: 'fea-1',
        module_id: 'mod-1',
        feature_name: '全部应用'
      },
      {
        feature_id: 'fea-2',
        module_id: 'mod-1',
        feature_name: '应用审核'
      },
      {
        feature_id: 'fea-3',
        module_id: 'mod-1',
        feature_name: '应用分类'
      },
      {
        feature_id: 'fea-4',
        module_id: 'mod-2',
        feature_name: '全部应用服务商'
      },
      {
        feature_id: 'fea-5',
        module_id: 'mod-2',
        feature_name: '认证审核'
      },
      {
        feature_id: 'fea-6',
        module_id: 'mod-2',
        feature_name: '合约管理'
      }
    ];
  }

  @action
  async fetchAllActions() {
    this.actions = [
      {
        action_id: 'act-1',
        feature_id: 'fea-1',
        action_name: '查看全部应用'
      },
      {
        action_id: 'act-2',
        feature_id: 'fea-1',
        action_name: '编辑应用'
      },
      {
        action_id: 'act-3',
        feature_id: 'fea-1',
        action_name: '添加应用'
      },
      {
        action_id: 'act-4',
        feature_id: 'fea-1',
        action_name: '删除应用'
      },
      {
        action_id: 'act-5',
        feature_id: 'fea-2',
        action_name: '查看应用审核'
      },
      {
        action_id: 'act-6',
        feature_id: 'fea-2',
        action_name: '编辑应用审核'
      },
      {
        action_id: 'act-7',
        feature_id: 'fea-3',
        action_name: '查看全部分类'
      },
      {
        action_id: 'act-8',
        feature_id: 'fea-3',
        action_name: '编辑分类'
      },
      {
        action_id: 'act-9',
        feature_id: 'fea-3',
        action_name: '添加分类'
      },
      {
        action_id: 'act-10',
        feature_id: 'fea-3',
        action_name: '删除分类'
      }
    ];
  }

  @action
  getModuleTreeData = () => {
    const { modules, features } = this;
    const data = [
      {
        key: KeyFeatureAll,
        title: '全部'
      }
    ];
    data[0].children = modules.map(item => ({
      key: item.module_id,
      title: item.module_name,
      children: features
        .filter(({ module_id }) => item.module_id === module_id)
        .map(feature => ({
          key: feature.feature_id,
          title: feature.feature_name
        }))
    }));
    return data;
  };

  @action
  getModuleActionData = module_id => {
    const data = [
      {
        key: KeyFeatureAll,
        title: '全部操作',
        children: this.features
          .filter(feature => module_id === feature.module_id)
          .map(feature => ({
            key: feature.feature_id,
            title: feature.feature_name,
            children: this.actions
              .filter(item => feature.feature_id === item.feature_id)
              .map(item => ({
                key: item.action_id,
                title: item.action_name
              }))
          }))
      }
    ];
    return data;
  };

  @action
  getFeatureActionData = (feature_id, name) => {
    const data = [
      {
        key: KeyFeatureAll,
        title: '全部操作',
        children: [
          {
            key: feature_id,
            title: name,
            children: this.actions
              .filter(item => feature_id === item.feature_id)
              .map(item => ({
                key: item.action_id,
                title: item.action_name
              }))
          }
        ]
      }
    ];
    return data;
  };

  @action
  getActionTreeData = () => {
    const { id, name, type } = this.selectedFeatureModule;

    if (type === KeyFeatureAll) {
      this.bingActions = this.modules.map(module => ({
        name: module.module_name,
        treeData: this.getModuleActionData(module.module_id)
      }));
    } else if (type === TypeModule) {
      this.bingActions = [
        {
          name: '',
          treeData: this.getModuleActionData(id)
        }
      ];
    } else if (type === TypeFeature) {
      this.bingActions = [
        {
          name: '',
          treeData: this.getFeatureActionData(id, name)
        }
      ];
    }
  };

  @action
  reset = () => {
    this.isLoading = true;
    this.roleDetail = {};
    this.roles = [];
    this.selectedRole = {};
  };

  @action
  selectRole = keys => {
    const key = _.first(keys);
    if (_.isEmpty(keys)) {
      this.selectedRole = {};
    } else if (key === KeyCreateRoll) {
      console.log('click');
    } else {
      const roles = _.filter(this.roles, role => role.role_id === key);
      this.selectedRole = _.first(roles);
    }
  };

  selectFeature = keys => {
    const key = _.first(keys);
    if (_.isEmpty(keys)) {
      this.selectedFeatureModule = {};
    } else if (key === KeyFeatureAll) {
      this.selectedFeatureModule = {
        type: KeyFeatureAll,
        name: '全部'
      };
    } else {
      const features = _.filter(
        this.features,
        feature => feature.feature_id === key
      );
      if (features.length > 0) {
        this.selectedFeatureModule = {
          id: key,
          type: TypeFeature,
          name: _.first(features).feature_name
        };
      } else {
        const modules = _.filter(
          this.modules,
          module => module.module_id === key
        );
        if (modules.length > 0) {
          this.selectedFeatureModule = {
            id: key,
            type: TypeModule,
            name: _.first(modules).module_name
          };
        } else {
          this.selectedFeatureModule = {};
        }
      }
    }
    this.getActionTreeData();
  };
}
