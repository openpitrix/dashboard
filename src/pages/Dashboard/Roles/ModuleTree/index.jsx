import React, { Component } from 'react';

import { Tree } from 'components/Base';

export default class ModuleTree extends Component {
  render() {
    const { roleStore } = this.props;
    const { selectFeature, getModuleTreeData } = roleStore;
    return (
      <div>
        <Tree
          defaultExpandAll
          hoverLine
          showLine
          onSelect={selectFeature}
          treeData={getModuleTreeData()}
        />
      </div>
    );
  }
}
