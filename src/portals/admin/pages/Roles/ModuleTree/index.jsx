import React, { Component } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { Tree } from 'components/Base';
import Loading from 'components/Loading';

@observer
export default class ModuleTree extends Component {
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
          selectedKeys={selectedModuleKeys}
          onSelect={onSelectModule}
          treeData={moduleTreeData}
        />
      </div>
    );
  }
}
