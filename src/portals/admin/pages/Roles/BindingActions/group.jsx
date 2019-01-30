import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import classnames from 'classnames';

import _ from 'lodash';

import { Tree } from 'components/Base';
import styles from './index.scss';

@observer
export default class ActionGroup extends Component {
  renderActionCount() {
    const { data, t } = this.props;
    const { selectedActions } = data;
    const { total, selectedCount } = selectedActions;
    const textCount = total === selectedCount
      ? t('BIND_ACTION_COUNT_ALL', selectedActions)
      : t('BIND_ACTION_COUNT', selectedCount);

    return (
      <span>
        {t('All actions')}
        <span className={styles.actionText}>({textCount})</span>
      </span>
    );
  }

  renderTreeTitle = node => {
    const { t, roleStore } = this.props;
    const { handelType } = roleStore;
    const disabled = handelType !== 'setBindAction';
    if (node.title === t('All actions')) {
      return this.renderActionCount();
    }

    if (disabled) {
      return null;
    }
    return node.title;
  };

  render() {
    const {
      data, keys, index, roleStore, t
    } = this.props;
    if (_.isEmpty(data)) {
      return null;
    }
    const { handelType, selectAction } = roleStore;
    const { name, treeData } = data;
    const disabled = handelType !== 'setBindAction';
    console.log(toJS(keys));

    return (
      <div className={styles.actions}>
        {!_.isEmpty(name) && <h3 className={styles.header}>{name}</h3>}
        <div>{t('Operation list')}</div>
        <Tree
          checkable
          defaultExpandAll
          disabled={disabled}
          selectable={false}
          checkedKeys={keys}
          className={classnames(styles.tree, {
            [styles.disabledTree]: disabled
          })}
          treeData={treeData}
          onCheck={selectAction(index)}
          renderTreeTitle={this.renderTreeTitle}
          switcherIcon={this.renderSwitchIcon}
        />
        <div>
          {t('Data range')}:
          <strong>{t(`data_level_${data.data_level}`)}</strong>
        </div>
      </div>
    );
  }
}
