import React, { Component } from 'react';
import { observer } from 'mobx-react';

import _ from 'lodash';
import Loading from 'components/Loading';

import ActionGroup from './group';

import styles from './index.scss';

@observer
export default class BindingActions extends Component {
  render() {
    const { roleStore, t } = this.props;
    const {
      selectedFeatureModule,
      isLoading,
      bingActions,
      selectedActionKeys
    } = roleStore;

    if (_.isEmpty(selectedFeatureModule)) {
      return null;
    }
    if (isLoading) {
      return <Loading isLoading />;
    }
    const { name } = selectedFeatureModule;

    return (
      <div className={styles.main}>
        <div>
          {t('Selected')}： <strong>「{name}」</strong>
        </div>
        {bingActions.map((data, index) => (
          <ActionGroup
            roleStore={roleStore}
            key={`${data.name}-${index}`}
            index={index}
            t={t}
            data={data}
            keys={selectedActionKeys[index]}
          />
        ))}
      </div>
    );
  }
}
