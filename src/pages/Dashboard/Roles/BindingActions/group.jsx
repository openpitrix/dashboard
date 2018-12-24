import React, { Component } from 'react';
import { observer } from 'mobx-react';

import _ from 'lodash';

import { Tree } from 'components/Base';
import styles from './index.scss';

@observer
export default class ActionGroup extends Component {
  render() {
    const { data } = this.props;
    if (_.isEmpty(data)) {
      return null;
    }
    const { name, treeData } = data;

    return (
      <div className={styles.main}>
        {!_.isEmpty(name) && <h3 className={styles.header}>{name}</h3>}
        <div>操作列表</div>
        <Tree
          defaultExpandAll
          checkable
          selectable={false}
          className={styles.tree}
          treeData={treeData}
        />
        <div>
          数据范围：
          <strong>所有数据</strong>
        </div>
      </div>
    );
  }
}
