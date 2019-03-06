import React, { Component } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { Tree } from 'components/Base';
import Loading from 'components/Loading';

import styles from '../index.scss';

@observer
export default class ModuleTree extends Component {
  componentDidUpdate() {
    const { onSelectModule, selectedFeatureModule } = this.props.roleStore;
    if (_.isEmpty(selectedFeatureModule)) {
      onSelectModule(['all']);
    }
  }

  render() {
    const { roleStore } = this.props;
    const { onSelectModule, moduleTreeData, selectedModuleKeys } = roleStore;

    if (_.isEmpty(moduleTreeData)) {
      return <Loading isLoading />;
    }

    return (
      <div>
        <Tree
          defaultExpandAll
          hoverLine
          showLine
          className={styles.moduleTree}
          selectedKeys={selectedModuleKeys}
          onSelect={onSelectModule}
          treeData={moduleTreeData}
        />
      </div>
    );
  }
}
