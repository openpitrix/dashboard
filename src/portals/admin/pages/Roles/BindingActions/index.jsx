import React, { Component } from 'react';
import { observer } from 'mobx-react';

import _ from 'lodash';
import Loading from 'components/Loading';

import ActionGroup from './group';

import styles from './index.scss';

@observer
export default class BindingActions extends Component {
  getActionKeys(idx) {
    const { selectedActionKeys } = this.props.roleStore;
    if (!selectedActionKeys.length) {
      return [];
    }

    return idx < selectedActionKeys.length ? selectedActionKeys[idx] : [];
  }

  render() {
    const { roleStore, t } = this.props;
    const { selectedFeatureModule, isLoading, bingActions } = roleStore;

    if (_.isEmpty(selectedFeatureModule)) {
      return null;
    }

    const { name } = selectedFeatureModule;

    return (
      <div className={styles.main}>
        <div>
          {t('Selected')}： <strong>「{name}」</strong>
        </div>
        <Loading isLoading={isLoading}>
          {bingActions.map((data, index) => (
            <ActionGroup
              roleStore={roleStore}
              key={`${data.name}-${index}`}
              index={index}
              t={t}
              data={data}
              keys={this.getActionKeys(index)}
            />
          ))}
        </Loading>
      </div>
    );
  }
}
