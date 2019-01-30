import { observable, action } from 'mobx';
import _ from 'lodash';
import { t } from 'i18next';
import { sleep } from 'utils';
import Store from '../Store';

const KeyFeatureAll = 'all';
const KeyCreateRoll = 'create_role';
const TypeModule = 'module';
const TypeFeature = 'feature';
const KeysRoleDisabled = ['admin_role', 'not_admin_role'];

const sortModule = id => (a, b) => {
  const numA = Number(_.last(a[id].split('_')));
  const numB = Number(_.last(b[id].split('_')));
  return numA - numB;
};

export default class RoleStore extends Store {
  @observable roles = [];

  @observable selectedRole = {};

  @observable selectedFeatureModule = {};

  @observable isLoading = true;

  @observable bingActions = [];

  @observable moduleTreeData = [];

  @observable modules = [];

  @observable features = [];

  @observable selectedRoleKeys = [];

  @observable selectedModuleKeys = [];

  @observable selectedActionKeys = [];

  @observable handelType = '';

  selectedModuleId = '';

  actions = [];

  get modal() {
    return this.getStore('modal');
  }

  @action
  async fetchAll() {
    this.isLoading = true;
    const result = await this.request.get(`roles`);
    this.roles = _.get(result, 'role');
    this.isLoading = false;
  }

  async fetchRoleModule(roleId) {
    const result = await this.request.get(`roles:module`, {
      role_id: roleId
    });
    this.modules = _.get(result, 'role_module.module', []);
    this.getModuleTreeData();
  }

  @action
  getModuleTreeData = () => {
    const { modules } = this;
    const data = [
      {
        key: KeyFeatureAll,
        title: t('All')
      }
    ];
    data[0].children = modules
      .slice()
      .sort(sortModule('module_id'))
      .map(item => ({
        key: item.module_id,
        title: item.module_name,
        children: item.feature
          .slice()
          .sort(sortModule('feature_id'))
          .map(feature => ({
            key: `${feature.feature_id}--${item.module_id}`,
            title: feature.feature_name
          }))
      }));
    this.moduleTreeData = data;

    return data;
  };

  @action
  getFeatureActionData = (feature_id, name) => {
    const data = [
      {
        key: KeyFeatureAll,
        title: t('All actions'),
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
  reset = () => {
    this.isLoading = true;
    this.roles = [];
    this.selectedRole = {};
    this.bingActions = [];
    this.moduleTreeData = [];
    this.modules = [];
    this.features = [];
    this.selectedRoleKeys = [];
    this.selectedActionKeys = [];
    this.handelType = '';
  };

  @action
  onSelectRole = keys => {
    const key = _.first(keys);
    if (KeysRoleDisabled.includes(key)) {
      return null;
    }
    if (_.isEmpty(keys)) {
      this.selectedRole = {};
    } else if (key === KeyCreateRoll) {
      this.modal.show('renderModalCreateRole');
      return;
    } else {
      this.fetchRoleModule(_.find(keys));
      const roles = _.filter(this.roles, role => role.role_id === key);
      this.selectedRole = _.first(roles);
      this.onSelectModule([]);
      this.selectedActionKeys = [];
    }
    this.selectedRoleKeys = keys;
    this.handelType = '';
  };

  @action
  selectAction = index => keys => {
    this.selectedActionKeys[index] = keys;
  };

  getSelectType = (keys, key) => {
    if (_.isEmpty(keys)) {
      this.selectedFeatureModule = {};
      return '';
    }

    if (key === KeyFeatureAll) {
      return KeyFeatureAll;
    }
    if (_.startsWith(key, 'm_')) {
      return TypeModule;
    }
    if (_.startsWith(key, 'f_')) {
      return TypeFeature;
    }

    throw new Error('Module type error');
  };

  @action
  getModuleActionData = () => {
    const data = [
      {
        key: KeyFeatureAll,
        title: t('All actions'),
        children: this.features
          .slice()
          .sort(sortModule('feature_id'))
          .map(feature => ({
            key: feature.feature_id,
            title: feature.feature_name,
            children: _.uniqBy(feature.action, 'action_id')
              .slice()
              .sort(sortModule('action_id'))
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
  setActionKeys = (checkAll, index = 0) => {
    let actionKeys = [];
    _.forEach(this.features, f => {
      if (checkAll) {
        actionKeys = _.concat(actionKeys, this.getUniqActions(f));
      } else {
        actionKeys = _.concat(actionKeys, f.checked_action_id);
      }
    });
    this.selectedActionKeys[index] = actionKeys;
  };

  @action
  getActionCount = ({ module, features }) => {
    const result = {
      total: 0,
      selectedCount: 0
    };

    features.forEach(feature => {
      const total = this.getUniqActions(feature).length;
      const selectedCount = _.uniq(feature.checked_action_id).length;
      result.total += total;
      if (module.is_check_all) {
        result.selectedCount += total;
      } else {
        result.selectedCount += selectedCount;
      }
    });
    return result;
  };

  @action
  getUniqActions = feature => _.flatMap(_.uniqBy(feature.action, 'action_id'), 'action_id');

  @action
  getActionTreeData = () => {
    const { name, type } = this.selectedFeatureModule;

    if (type === KeyFeatureAll) {
      this.bingActions = this.modules
        .slice()
        .sort(sortModule('module_id'))
        .map((module, index) => {
          this.features = module.feature;
          this.setActionKeys(module.is_check_all, index);
          const selectedActions = this.getActionCount({
            module,
            features: module.feature
          });
          return {
            name: module.module_name,
            data_level: module.data_level,
            treeData: this.getModuleActionData(),
            selectedActions
          };
        });
      return;
    }

    const moduleItem = this.getModule();
    if (type === TypeModule) {
      const selectedActions = this.getActionCount({
        module: moduleItem,
        features: moduleItem.feature
      });
      this.bingActions = [
        {
          name,
          data_level: moduleItem.data_level,
          treeData: this.getModuleActionData(),
          selectedActions
        }
      ];
      this.setActionKeys(moduleItem.is_check_all);
    } else if (type === TypeFeature) {
      const selectedActions = this.getActionCount({
        module: moduleItem,
        features: this.features.slice()
      });
      this.bingActions = [
        {
          name,
          data_level: moduleItem.data_level,
          treeData: this.getModuleActionData(),
          selectedActions
        }
      ];
      this.setActionKeys(moduleItem.is_check_all);
    }
  };

  @action
  onSelectModule = keys => {
    const key = _.first(keys);
    this.selectedModuleKeys = keys;
    const type = this.getSelectType(keys, key);
    if (type === KeyFeatureAll) {
      this.selectedFeatureModule = {
        type: KeyFeatureAll,
        name: t('All')
      };
    } else if (type === TypeModule) {
      const module = _.find(this.modules, { module_id: key });
      if (!module) {
        return null;
      }
      this.selectedFeatureModule = {
        type: TypeModule,
        name: module.module_name
      };
      this.selectedModuleId = module.module_id;
      this.features = module.feature;
    } else if (type === TypeFeature) {
      const names = key.split('--');
      const moduleId = _.last(names);
      const featureId = _.first(names);
      const module = _.find(this.modules, { module_id: moduleId });
      const feature = _.find(module.feature, { feature_id: featureId });
      this.selectedFeatureModule = {
        type: TypeFeature,
        name: feature.feature_name
      };
      this.features = [feature];
      this.selectedModuleId = module.module_id;
    }
    this.getActionTreeData();
  };

  @action
  createRole = async (e, data) => {
    const handleType = !data.role_id ? 'post' : 'patch';
    const result = await this.request[handleType](`am/roles`, data);

    const roleId = _.get(result, 'role_id');
    if (roleId) {
      this.createRoleId = roleId;
      await this.fetchAll();
      if (handleType === 'post') {
        this.modal.show('renderModalCreateRoleSuccess');
      } else {
        this.modal.hide();
      }
    }
  };

  @action
  setBindAction = () => {
    // this.selectedRoleKeys = [this.createRoleId];
    const keys = [this.createRoleId];
    this.selectedRoleKeys = keys;
    this.modal.hide();
    this.onSelectRole(keys);
    // this.onSelectRole(['role-mxcrg3ghvr6']);
  };

  @action
  setHandleType = type => {
    this.handelType = type;
    if (type === '') {
      this.getActionTreeData();
    }
  };

  @action
  getCheckedAction = (feature, index = 0) => {
    _.remove(
      this.selectedActionKeys[index],
      key => _.startsWith(key, 'f_') || key === 'all'
    );
    const featureActions = _.flatMap(feature.action, 'action_id');
    feature.checked_action_id = _.intersection(
      this.selectedActionKeys[index],
      featureActions
    );
  };

  @action
  changeRoleModule = async () => {
    this.isLoading = true;
    const { type } = this.selectedFeatureModule;
    let module = [];
    if (type === KeyFeatureAll) {
      module = this.modules
        .slice()
        .sort(sortModule('module_id'))
        .map((item, index) => {
          item.feature.forEach(f => {
            this.getCheckedAction(f, index);
          });
          return item;
        });
    } else {
      const item = _.find(this.modules, { module_id: this.selectedModuleId });
      item.feature.forEach(f => {
        this.getCheckedAction(f);
      });
      module.push(item);
    }
    const data = {
      role_module: {
        role_id: _.find(this.selectedRoleKeys),
        module
      }
    };
    await this.request.patch(`am/roles:module`, data);
    await sleep(300);
    this.isLoading = false;
    this.setHandleType('');
  };

  @action
  getRole = () => _.find(this.roles, { role_id: _.first(this.selectedRoleKeys) });

  @action
  getModule = () => _.find(this.modules, { module_id: this.selectedModuleId }, {});

  @action getRoleName = () => _.get(this.getRole(), 'role_name', '');

  @action
  deleteRole = async () => {
    this.isLoading = true;
    const result = await this.request.delete(`am/roles`, {
      role_id: this.selectedRoleKeys
    });
    const roleId = _.get(result, 'role_id');
    if (roleId) {
      this.fetchAll();
    }

    this.isLoading = false;
  };

  @action
  showEditRole = () => {
    const role = this.getRole();
    this.modal.show('renderModalCreateRole', {
      ...role,
      handleType: 'edit'
    });
  };
}
