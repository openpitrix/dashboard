import React, { Component } from 'react';
import { observer } from 'mobx-react';

import _ from 'lodash';

import ActionGroup from './group';

import styles from './index.scss';

@observer
export default class BindingActions extends Component {
  render() {
    const { roleStore } = this.props;
    const { selectedFeatureModule, bingActions } = roleStore;

    if (_.isEmpty(selectedFeatureModule)) {
      return null;
    }
    const { name } = selectedFeatureModule;

    return (
      <div className={styles.main}>
        <div>
          所选： <strong>「{name}」</strong>
        </div>
        {bingActions.map((data, index) => (
          <ActionGroup key={`${data.name}-${index}`} data={data} />
        ))}
      </div>
    );
  }
}
