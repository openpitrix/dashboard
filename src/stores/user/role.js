import { observable, action } from 'mobx';
import _ from 'lodash';
import { sleep } from 'utils';
import Store from '../Store';

const KeyFeatureAll = 'all';
const TypeModule = 'module';
const TypeFeature = 'feature';

const sortModule = id => (a, b) => {
  const numA = Number(_.last(a[id].split(id[0])));
  const numB = Number(_.last(b[id].split(id[0])));
  return numA - numB;
};

const defaultCheck = {
  type: KeyFeatureAll,
  name: 'All'
};

export default class RoleStore extends Store {
  @observable roles = [];

  @observable selectedRole = {};

  @observable selectedFeatureModule = { ...defaultCheck };

  @observable isLoading = false;

  @observable bindActions = [];

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

  get role() {
    return _.find(this.roles, { role_id: _.first(this.selectedRoleKeys) });
  }

  get module() {
    return _.find(this.modules, { module_id: this.selectedModuleId }, {});
  }

  get roleName() {
    return _.get(this.role, 'role_name', '');
  }

  get selectedFeatureId() {
    return _.get(this.features, '0.feature_id');
  }

  @action
  async fetchAll() {
    this.isLoading = true;
    const result = await this.request.get(`roles`);
    this.roles = _.get(result, 'role');
    this.isLoading = false;
  }

  async fetchRoleModule(roleId) {
    this.isLoading = true;
    const result = await this.request.get(`roles:module`, {
      role_id: roleId
    });
    this.modules = _.get(result, 'role_module.module', []);
    this.getModuleTreeData();
    this.isLoading = false;
  }

  @action
  getModuleTreeData = () => {
    const data = [
      {
        key: KeyFeatureAll,
        title: 'All'
      }
    ];

    data[0].children = this.modules
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
  getFeatureActionData = (feature_id, name) => [
    {
      key: KeyFeatureAll,
      title: 'All actions',
      children: [
        {
          key: feature_id,
          title: name,
          children: this.actions
            .filter(item => feature_id === item.feature_id)
            .map(item => ({
              key: item.action_bundle_id,
              title: item.action_bundle_name
            }))
        }
      ]
    }
  ];

  @action
  reset = () => {
    this.isLoading = true;
    this.roles = [];
    this.selectedRole = {};
    this.bindActions = [];
    this.moduleTreeData = [];
    this.modules = [];
    this.features = [];
    this.selectedRoleKeys = [];
    this.selectedActionKeys = [];
    Object.assign(this.selectedFeatureModule, defaultCheck);
    this.handelType = '';
  };

  @action
  onSelectRole = async (keys = []) => {
    if (_.isEmpty(keys)) {
      this.selectedRole = {};
    } else {
      const roleKey = _.first(keys);

      await this.fetchRoleModule(roleKey);
      const roles = _.filter(this.roles, role => role.role_id === roleKey);
      this.selectedRole = _.first(roles);
      this.onSelectModule(['all']);
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
      Object.assign(this.selectedFeatureModule, defaultCheck);
      return '';
    }

    if (key === KeyFeatureAll) {
      return KeyFeatureAll;
    }
    if (key.includes('--')) {
      return TypeFeature;
    }
    if (_.startsWith(key, 'm')) {
      return TypeModule;
    }

    throw new Error('Module type error');
  };

  @action
  getModuleActionData = () => {
    const data = [
      {
        key: KeyFeatureAll,
        title: 'All actions',
        children: this.features
          .slice()
          .sort(sortModule('feature_id'))
          .map(feature => ({
            key: feature.feature_id,
            title: feature.feature_name,
            children: _.uniqBy(feature.action_bundle, 'action_bundle_id')
              .slice()
              .sort(sortModule('action_bundle_id'))
              .map(item => ({
                key: item.action_bundle_id,
                title: item.action_bundle_name
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
    this.selectedActionKeys[index] = actionKeys.filter(Boolean);
  };

  @action
  getActionCount = ({ module, features }) => {
    const result = {
      total: 0,
      selectedCount: 0
    };

    features.forEach(feature => {
      const total = this.getUniqActions(feature).length;
      feature.checked_action_id = feature.checked_action_id || [];
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
  getUniqActions = feature => _.flatMap(
    _.uniqBy(feature.action_bundle, 'action_bundle_id'),
    'action_bundle_id'
  );

  @action
  getActionTreeData = () => {
    const { name, type } = this.selectedFeatureModule;

    if (type === KeyFeatureAll) {
      this.bindActions = this.modules
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

    const moduleItem = this.module;
    if (type === TypeModule) {
      const selectedActions = this.getActionCount({
        module: moduleItem,
        features: moduleItem.feature
      });
      this.bindActions = [
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
      this.bindActions = [
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
  onSelectModule = (keys = []) => {
    const key = _.first(keys);
    this.selectedModuleKeys = keys;
    const type = this.getSelectType(keys, key);

    if (type === KeyFeatureAll) {
      Object.assign(this.selectedFeatureModule, defaultCheck);
    } else if (type === TypeModule) {
      const module = _.find(this.modules, { module_id: key });
      if (!module) {
        return null;
      }
      Object.assign(this.selectedFeatureModule, {
        type: TypeModule,
        name: module.module_name
      });
      this.selectedModuleId = module.module_id;
      this.features = module.feature;
    } else if (type === TypeFeature) {
      const names = key.split('--');
      const moduleId = _.last(names);
      const featureId = _.first(names);
      const module = _.find(this.modules, { module_id: moduleId });
      const feature = _.find(module.feature, { feature_id: featureId });
      Object.assign(this.selectedFeatureModule, {
        type: TypeFeature,
        name: feature.feature_name
      });

      this.features = [feature];
      this.selectedModuleId = module.module_id;
    }

    this.getActionTreeData();
  };

  @action
  createRole = async (e, data) => {
    const handleType = !data.role_id ? 'post' : 'patch';
    const result = await this.request[handleType](`roles`, data);

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
    const featureActions = _.flatMap(feature.action_bundle, 'action_bundle_id');
    feature.checked_action_id = _.intersection(
      this.selectedActionKeys[index],
      featureActions
    );
  };

  @action
  setCheckall = modules => {
    modules
      .slice()
      .sort(sortModule('module_id'))
      .forEach((module, index) => {
        const { type } = this.selectedFeatureModule;
        const features = type === TypeFeature ? this.features : module.feature;
        const selectedActions = this.getActionCount({
          module,
          index,
          features
        });
        const { total } = selectedActions;
        const checkActions = _.filter(this.selectedActionKeys[index], key => key.includes('.a'));
        const isCheckAll = total === checkActions.length;
        if (!isCheckAll) {
          module.is_check_all = isCheckAll;
        }
      });
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
      const item = this.module;
      item.feature.forEach(f => {
        if (type === TypeFeature && this.selectedFeatureId === f.feature_id) {
          this.getCheckedAction(f);
        }
      });
      module.push(item);
    }
    const data = {
      role_module: {
        role_id: _.find(this.selectedRoleKeys),
        module
      }
    };
    this.setCheckall(module);
    const result = await this.request.patch(`roles:module`, data);
    await sleep(300);
    if (_.get(result, 'role_module.role_id')) {
      this.fetchRoleModule(_.first(this.selectedRoleKeys));
      this.onSelectModule([]);
    }
    this.isLoading = false;
    this.setHandleType('');
  };

  @action
  deleteRole = async () => {
    this.isLoading = true;
    const result = await this.request.delete(`roles`, {
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
    this.modal.show('renderModalCreateRole', {
      ...this.role,
      handleType: 'edit'
    });
  };
}
