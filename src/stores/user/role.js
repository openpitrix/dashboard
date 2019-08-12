import { action } from 'mobx';
import _ from 'lodash';
import { sleep, checkAction, getModuleSession } from 'utils';
import { PORTAL_NAME, DATA_LEVEL } from 'config/roles';

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

const regModuleId = /^m\d+$/;

const regFeatureId = /^m\d+\.f\d+$/;

const regNotAction = /^m\d*(.f\d*)?$/;

export default class RoleStore extends Store {
  selectedModuleId = '';

  actions = [];

  constructor(...args) {
    super(...args);

    this.defineObservables(function () {
      this.roles = [];

      this.selectedRole = {};

      this.selectedFeatureModule = { ...defaultCheck };

      this.isLoading = false;

      this.modalLoading = false;

      this.bindActions = [];

      this.moduleTreeData = [];

      this.modules = [];

      this.moduleNames = {};

      this.features = [];

      this.selectedRoleKeys = [];

      this.selectedModuleKeys = [];

      this.selectedActionKeys = [];

      this.handelType = '';

      this.dataLevelMap = {};

      this.dataLevel = defaultDataLevel;

      this.openModuleMap = {};
    });
  }

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
      const p1 = portals.indexOf(a.portal);
      const p2 = portals.indexOf(b.portal);
      const o1 = controllers.indexOf(a.controller);
      const o2 = controllers.indexOf(b.controller);

      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
      if (o1 < o2) return -1;
      if (o1 > o2) return 1;

      if (a.portal === 'isv') {
        const isvSort = ['developer', 'isv'];
        const isv1 = isvSort.indexOf(a.role_id);
        const isv2 = isvSort.indexOf(b.role_id);

        if (isv1 < isv2) return 1;
        if (isv1 > isv2) return -1;
      }
      return 0;
    };
  }

  get moduleSession() {
    return getModuleSession();
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
    this.roles = _.get(result, 'role_set', [])
      .slice()
      .sort(this.sortRole);
    const firstId = _.get(_.first(this.roles), 'role_id');
    this.onSelectRole([firstId]);
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
    this.moduleNames[roleId] = _.get(result, 'module.module_elem_set', []);
    this.isLoading = false;
  }

  @action
  getModuleTreeData = () => {
    const data = [
      {
        key: KeyFeatureAll,
        title: 'All',
        hasCheck: true
      }
    ];

    data[0].children = this.modules
      .slice()
      .sort(sortModule('module_id'))
      .map(item => ({
        key: item.module_id,
        title: item.module_name,
        hasCheck: this.hasFeatureAction(item.module_id, 'module'),
        children: item.feature_set
          .slice()
          .sort(sortModule('feature_id'))
          .map(feature => ({
            key: `${feature.feature_id}--${item.module_id}`,
            title: feature.feature_name,
            hasCheck: this.hasFeatureAction(feature.feature_id)
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
  onSelectRole = async (keys = []) => {
    if (_.isEmpty(keys)) {
      return null;
    }
    const roleKey = _.first(keys);

    // 不给 treeData 置空直接赋予新的值会造成渲染 bug
    this.emptyTreeData();
    await this.fetchRoleModule(roleKey);
    this.onSelectModule([KeyFeatureAll]);
    this.selectedRoleKeys = keys;
    this.setSelectedRole();
    this.handelType = '';
  };

  @action
  emptyTreeData = () => {
    this.moduleTreeData = [];
    this.bindActions = [];
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

    this.bindActions[index].selectedActions.selectedCount = keys.filter(
      a => !regNotAction.test(a) && a !== defaultDataLevel
    ).length;
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
            children: _.uniqBy(
              feature.action_bundle_set || [],
              'action_bundle_id'
            )
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

    _.forEach(features, feature => {
      if (!feature) {
        return;
      }
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
  setBindAction = async () => {
    const keys = [this.createRoleId];
    this.selectedRoleKeys = keys;
    this.modal.hide();
    await this.onSelectRole(keys);
    this.setHandleType('setBindAction');
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
      feature.action_bundle_set || [],
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
        const checkActions = _.filter(
          this.selectedActionKeys[index],
          key => !regNotAction.test(key)
        );
        const isCheckAll = total === checkActions.length;
        module.is_check_all = isCheckAll;
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
          } else if (
            type === TypeModule
            && this.selectedModuleId === item.module_id
          ) {
            this.getCheckedAction(f);
          } else if (
            type === TypeFeature
            && f.feature_id === _.get(this.features, '[0].feature_id')
          ) {
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
      this.onSelectModule(this.selectedModuleKeys);
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
    this.dataLevel = _.get(this.modules, '[0].data_level');
  };

  @action
  changeDataLevelMap = (id, dataLevel) => {
    this.dataLevelMap[id] = dataLevel;
  };

  @action
  initIsv = async roleId => {
    this.modalLoading = true;
    await this.fetchRoleModule(roleId);
    if (roleId === PORTAL_NAME.isv) {
      this.emptyCheckAction();
      this.dataLevel = DATA_LEVEL.self;
    }
    this.onSelectModule([KeyFeatureAll]);
    this.setHandleType('setBindAction');
    this.modalLoading = false;
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
      .sort(sortModule('module_id'))
      .map((item, index) => {
        item.data_level = this.dataLevel;
        item.feature_set.forEach(f => {
          this.getCheckedAction(f, index);
        });
        return item;
      });
    const data = {
      role_id: roleId,
      module: {
        module_elem_set: module
      }
    };
    this.setCheckall(module);
    this.request.post(`roles:module`, data);
  };

  @action
  changeDataLevel = dataLevel => {
    this.dataLevel = dataLevel;
  };

  changeOpenModuleMap = (id, value) => {
    const modules = this.modules.slice().sort(sortModule('module_id'));
    const index = _.findIndex(modules, { module_id: id });
    if (value) {
      const { treeData } = this.bindActions[index];
      const keys = [];
      this.getAllModuleActionIds(treeData, keys);
      this.selectAction(index)(keys);
    } else {
      this.selectAction(index)([]);
    }
    this.openModuleMap[id] = value;
  };

  getAllModuleActionIds = (array, keys = []) => {
    _.forEach(array, item => {
      if (!regNotAction.test(item.key)) {
        keys.push(item.key);
      }
      this.getAllModuleActionIds(item.children, keys);
    });
  };

  setRoleSession = async () => {
    const roleId = _.get(this.getUser(), 'role');
    if (!roleId) {
      return [];
    }
    let modules = sessionStorage.getItem('module_elem_set');
    if (modules) {
      return modules;
    }
    const result = await this.request.get(`roles:module`, {
      role_id: roleId
    });
    modules = _.get(result, 'module.module_elem_set', []);
    sessionStorage.setItem('module_elem_set', JSON.stringify(modules));
    return modules;
  };

  checkAction = checkAction;

  hasFeatureAction = (id, type = 'feature') => {
    if (type === 'feature' && !regFeatureId.test(id)) {
      return false;
    }
    if (type === 'module' && !regModuleId.test(id)) {
      return false;
    }
    const module_id = id.split('.')[0];
    const module = _.find(this.modules, {
      module_id
    });
    if (!module || !_.isArray(module.feature_set)) {
      return false;
    }
    let features = module.feature_set;
    if (type === 'feature') {
      features = [
        _.find(module.feature_set, {
          feature_id: id
        })
      ];
    }
    const { selectedCount } = this.getActionCount({
      module,
      features
    });
    return _.isNumber(selectedCount) && selectedCount > 0;
  };
}
