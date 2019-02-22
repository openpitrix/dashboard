import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import _ from 'lodash';

import { Tree, Select } from 'components/Base';
import { moduleDataLevels } from 'config/roles';

import styles from './index.scss';

@observer
export default class ActionGroup extends Component {
  get disabled() {
    return _.get(this.props, 'roleStore.handelType') !== 'setBindAction';
  }

  renderActionCount() {
    const { t, data } = this.props;
    const { selectedActions } = data;
    const { total, selectedCount } = selectedActions;
    const textCount = total === selectedCount
      ? t('BIND_ACTION_COUNT_ALL', selectedActions)
      : t('BIND_ACTION_COUNT', selectedActions);

    return (
      <span>
        {t('All actions')}
        <span className={styles.actionText}>({textCount})</span>
      </span>
    );
  }

  renderTreeTitle = node => {
    const { t } = this.props;

    if (node.title === 'All actions') {
      return this.renderActionCount();
    }

    if (this.disabled) {
      return null;
    }
    return t(node.title);
  };

  renderHeader() {
    const { data, t, hideHeader } = this.props;
    const { name } = data;
    if (hideHeader) {
      return null;
    }

    return (
      <Fragment>
        {!_.isEmpty(name) && <h3 className={styles.header}>{t(name)}</h3>}
        <div>{t('Operation list')}</div>
      </Fragment>
    );
  }

  renderDataLevel() {
    const {
      data, t, roleStore, hideDataLevel
    } = this.props;
    const { dataLevelMap } = roleStore;
    const moduleId = _.first(data.id.split('.'));
    if (hideDataLevel) {
      return null;
    }

    if (this.disabled) {
      return (
        <div className={styles.dataLevel}>
          {t('Data range')}:
          <strong>{t(`data_level_${data.data_level}`)}</strong>
        </div>
      );
    }

    return (
      <div className={styles.dataLevel}>
        {t('Data range')}:
        <Select
          className={styles.select}
          value={dataLevelMap[moduleId]}
          onChange={value => roleStore.changeDataLevelMap(moduleId, value)}
        >
          {moduleDataLevels.map(item => (
            <Select.Option key={item} value={item}>
              {t(`data_level_${item}`)}
            </Select.Option>
          ))}
        </Select>
      </div>
    );
  }

  render() {
    const {
      keys, data, index, roleStore
    } = this.props;
    if (_.isEmpty(data)) {
      return null;
    }
    const { selectAction } = roleStore;
    const { treeData } = data;

    return (
      <div className={styles.actions}>
        {this.renderHeader()}
        <Tree
          checkable
          defaultExpandAll
          disabled={this.disabled}
          selectable={false}
          checkedKeys={keys}
          className={classnames(styles.tree, {
            [styles.disabledTree]: this.disabled
          })}
          treeData={treeData}
          onCheck={selectAction(index)}
          renderTreeTitle={this.renderTreeTitle}
          switcherIcon={this.renderSwitchIcon}
        />
        {this.renderDataLevel()}
      </div>
    );
  }
}
