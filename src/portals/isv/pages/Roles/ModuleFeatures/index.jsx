import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import _ from 'lodash';

import styles from './index.scss';

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
      <div className={styles.container}>
        {getArray(modules, 'module_id').map(module => (
          <div key={module.module_id}>
            <div className={classnames(styles.item, styles.moduleName)}>
              {module.module_name}
            </div>
            {getArray(module.feature_set, 'feature_id').map(feature => (
              <div
                key={feature.feature_id}
                className={classnames(styles.item, {
                  [styles.gray]: !isCheckAll(module, feature),
                  [styles.moduleName]: isCheckAll(module, feature)
                })}
              >
                {feature.feature_name}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}
