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
const defaultStatus = ['active'];

const defaultDataLevel = 'all';

export default class RoleStore extends Store {
  @observable roles = [];

  @observable selectedRole = {};

  @observable selectedFeatureModule = { ...defaultCheck };

  @observable isLoading = false;

  @observable bindActions = [];

  @observable moduleTreeData = [];

  @observable modules = [];

  @observable moduleNames = {};

  @observable features = [];

  @observable selectedRoleKeys = [];

  @observable selectedModuleKeys = [];

  @observable selectedActionKeys = [];

  @observable handelType = '';

  @observable dataLevelMap = {};

  @observable dataLevel = defaultDataLevel;

  @observable openModuleMap = {};

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

  get sortRole() {
    return (a, b) => {
      const portals = ['global_admin', 'isv', 'user'];
      const controllers = ['pitrix', 'self'];
      const o1 = controllers.indexOf(a.controller);
      const o2 = controllers.indexOf(b.controller);
      const p1 = portals.indexOf(a.portal);
      const p2 = portals.indexOf(b.portal);

      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
      if (o1 < o2) return -1;
      if (o1 > o2) return 1;
      return 0;
    };
  }

  @action
  async fetchAll(param = {}) {
    const defaultParams = {
      status: defaultStatus
    };
    this.isLoading = true;
    const result = await this.request.get(
      `roles`,
      _.assign(defaultParams, param)
    );
    this.roles = _.get(result, 'role_set');
    this.setSelectedRole();
    this.isLoading = false;
  }

  @action
  async fetchRoleModule(roleId) {
    this.isLoading = true;
    const result = await this.request.get(`roles:module`, {
      role_id: roleId
    });
    this.modules = _.get(result, 'module.module_elem_set', []);
    this.getModuleTreeData();
    this.setDataLevelMap();
    this.isLoading = false;
  }

  @action
  async fetchRoleModuleName(roleId) {
    this.isLoading = true;
    const result = await this.request.get(`roles:module`, {
      role_id: roleId
    });
    this.moduleNames[roleId] = _.get(result, 'role_module.module', []);
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
        children: item.feature_set
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
    this.dataLevelMap = {};
    this.dataLevel = defaultDataLevel;
    this.openModuleMap = {};
    this.handelType = '';
  };

  @action
  onSelectRole = async (keys = []) => {
    if (_.isEmpty(keys)) {
      return null;
    }
    const roleKey = _.first(keys);

    await this.fetchRoleModule(roleKey);
    this.onSelectModule([KeyFeatureAll]);
    this.selectedRoleKeys = keys;
    this.setSelectedRole();
    this.handelType = '';
  };

  @action
  setSelectedRole = () => {
    const roleKey = _.first(this.selectedRoleKeys);
    const roles = _.filter(this.roles, role => role.role_id === roleKey);
    this.selectedRole = _.first(roles);
  };

  @action
  selectAction = index => keys => {
    this.selectedActionKeys[index] = keys;

    this.bindActions[index].selectedActions.selectedCount = keys.filter(a => a.includes('.a')).length;
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
            children: _.uniqBy(feature.action_bundle_set, 'action_bundle_id')
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
        actionKeys = _.concat(actionKeys, f.checked_action_bundle_id_set);
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
      feature.checked_action_bundle_id_set = feature.checked_action_bundle_id_set || [];
      const selectedCount = _.uniq(feature.checked_action_bundle_id_set).length;
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
    _.uniqBy(feature.action_bundle_set, 'action_bundle_id'),
    'action_bundle_id'
  );

  @action
  getActionTreeData = () => {
    const { name, id, type } = this.selectedFeatureModule;

    if (type === KeyFeatureAll) {
      this.bindActions = this.modules
        .slice()
        .sort(sortModule('module_id'))
        .map((module, index) => {
          this.features = module.feature_set;
          this.setActionKeys(module.is_check_all, index);
          const selectedActions = this.getActionCount({
            module,
            features: module.feature_set
          });
          return {
            name: module.module_name,
            id: module.module_id,
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
        features: moduleItem.feature_set
      });
      this.bindActions = [
        {
          name,
          id,
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
          id,
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
    if (_.isEmpty(keys)) {
      return null;
    }
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
        id: module.module_id,
        name: module.module_name
      });
      this.selectedModuleId = module.module_id;
      this.features = module.feature_set;
    } else if (type === TypeFeature) {
      const names = key.split('--');
      const moduleId = _.last(names);
      const featureId = _.first(names);
      const module = _.find(this.modules, { module_id: moduleId });
      const feature = _.find(module.feature_set, { feature_id: featureId });
      Object.assign(this.selectedFeatureModule, {
        type: TypeFeature,
        id: feature.feature_id,
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
    const featureActions = _.flatMap(
      feature.action_bundle_set,
      'action_bundle_id'
    );
    feature.checked_action_bundle_id_set = _.intersection(
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
        const features = type === TypeFeature ? this.features : module.feature_set;
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
    const module = this.modules
      .slice()
      .sort(sortModule('module_id'))
      .map((item, index) => {
        item.feature_set.forEach(f => {
          if (type === KeyFeatureAll) {
            this.getCheckedAction(f, index);
          } else if (this.selectedModuleId === item.module_id) {
            this.getCheckedAction(f);
          }
        });
        return item;
      });

    const data = {
      role_id: _.find(this.selectedRoleKeys),
      module: {
        module_elem_set: module
      }
    };
    this.setCheckall(module);
    this.setDataLevel(module);
    const result = await this.request.post(`roles:module`, data);
    await sleep(300);
    if (_.get(result, 'role_id')) {
      this.onSelectModule([]);
      await this.fetchRoleModule(_.first(this.selectedRoleKeys));
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
      this.selectedRole = {};
      this.fetchAll();
      this.modal.hide();
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

  @action
  setDataLevel = modules => {
    _.forEach(modules, module => {
      const dataLevel = this.dataLevelMap[module.module_id];
      if (dataLevel) {
        module.data_level = dataLevel;
      }
    });
  };

  @action
  setDataLevelMap = () => {
    _.forEach(this.modules, module => {
      this.dataLevelMap[module.module_id] = module.data_level;
    });
  };

  @action
  changeDataLevelMap = (id, dataLevel) => {
    this.dataLevelMap[id] = dataLevel;
  };

  @action
  initIsv = async () => {
    await this.fetchRoleModule('isv');
    this.emptyCheckAction();
    this.onSelectModule([KeyFeatureAll]);
    this.setHandleType('setBindAction');
  };

  @action
  emptyCheckAction = () => {
    _.forEach(this.modules, module => {
      module.is_check_all = false;
      _.forEach(module.feature_set, feature => {
        feature.checked_action_bundle_id_set = [];
      });
    });
  };

  @action
  createISVRole = async (e, data) => {
    this.isLoading = true;
    const handleType = !data.role_id ? 'post' : 'patch';
    const result = await this.request[handleType](`roles`, data);

    const roleId = _.get(result, 'role_id');
    if (roleId) {
      this.createRoleId = roleId;

      await this.changeISVRoleModule(roleId);
      await this.fetchAll({ portal: 'isv' });
      this.modal.hide();
    }
    this.isLoading = false;
  };

  @action
  changeISVRoleModule = async roleId => {
    const module = this.modules
      .slice()
      .filter(m => this.openModuleMap[m.module_id])
      .sort(sortModule('module_id'))
      .map((item, index) => {
        item.data_level = this.dataLevel;
        item.feature_set.forEach(f => {
          this.getCheckedAction(f, index);
        });
        return item;
      });
    const data = {
      role_module: {
        role_id: roleId,
        module
      }
    };
    this.setCheckall(module);
    const result = await this.request.post(`roles:module`, data);
    if (_.get(result, 'role_module.role_id')) {
      this.onSelectModule([]);
      await this.fetchRoleModule(_.first(this.selectedRoleKeys));
    }
  };

  @action
  changeDataLevel = dataLevel => {
    this.dataLevel = dataLevel;
  };

  changeOpenModuleMap = (id, value) => {
    this.openModuleMap[id] = value;
  };
}
