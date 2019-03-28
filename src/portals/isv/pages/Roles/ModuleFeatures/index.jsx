import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import _ from 'lodash';

import styles from '../index.scss';

const sortModule = id => (a, b) => {
  const numA = Number(_.last(a[id].split(id[0])));
  const numB = Number(_.last(b[id].split(id[0])));
  return numA - numB;
};

const getArray = (array, id) => {
  if (!_.isArray(array)) return [];

  return array.slice().sort(sortModule(id));
};

const isCheckAll = (module, feature) => {
  if (module.is_check_all) {
    return true;
  }
  const getUniqActions = () => _.flatMap(
    _.uniqBy(feature.action_bundle, 'action_bundle_id'),
    'action_bundle_id'
  );

  const total = getUniqActions(feature).length;
  const selectedCount = _.uniq(feature.checked_action_id).length;
  return selectedCount === total;
};

@observer
export default class ModuleFeatures extends Component {
  render() {
    const { roleStore, roleId } = this.props;
    const { moduleNames } = roleStore;
    const modules = moduleNames[roleId];
    if (!modules) return null;

    return (
      <div className={styles.moduleContainer}>
        {getArray(modules, 'module_id').map(module => (
          <div key={module.module_id}>
            {getArray(module.feature_set, 'feature_id').map(feature => (_.isArray(feature.checked_action_bundle_id_set) ? (
                <Fragment key={`${module.module_id}-${feature.feature_id}`}>
                  <div
                    key={feature.feature_id}
                    className={classnames(styles.item, {
                      [styles.gray]: !isCheckAll(module, feature),
                      [styles.moduleName]: isCheckAll(module, feature)
                    })}
                  >
                    {feature.feature_name}
                  </div>
                  {getArray(feature.action_bundle_set, 'action_bundle_id').map(
                    action => (
                      <div
                        key={action.action_bundle_id}
                        className={classnames(styles.item, styles.gray)}
                      >
                        {feature.checked_action_bundle_id_set.includes(
                          action.action_bundle_id
                        )
                          ? action.action_bundle_name
                          : null}
                      </div>
                    )
                  )}
                </Fragment>
            ) : null))}
          </div>
        ))}
      </div>
    );
  }
}
