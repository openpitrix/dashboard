import _ from 'lodash';
import { CONDITION } from 'config/action-id';

export const getModuleSession = () => JSON.parse(sessionStorage.getItem('module_elem_set'));

const checkActionOnce = action_bundle_id => {
  let canDo = false;
  _.some(getModuleSession(), module => {
    const checkAll = module.is_check_all;
    return _.some(module.feature_set, feature => {
      const actionSet = _.find(feature.action_bundle_set, {
        action_bundle_id
      });
      if (actionSet) {
        const checkedAction = feature.checked_action_bundle_id_set || [];
        canDo = checkAll || checkedAction.includes(actionSet.action_bundle_id);
        return true;
      }
    });
  });

  return canDo;
};

const checkAction = (actionId, condition = CONDITION.or) => {
  if (_.isArray(actionId)) {
    if (condition === CONDITION.and) {
      return _.every(actionId, id => checkActionOnce(id));
    }
    return _.some(actionId, id => checkActionOnce(id));
  }
  return checkActionOnce(actionId);
};

export default checkAction;

// checkAction for method's property of class
export function canRender(actionId, condition = CONDITION.or) {
  return function (target, prop, descriptor) {
    if (!checkAction(actionId, condition)) {
      delete descriptor.initializer;
      delete descriptor.writable;
      descriptor.get = function () {
        return null;
      };
    }
  };
}
