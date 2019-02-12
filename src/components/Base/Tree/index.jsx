import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import _ from 'lodash';

import RcTree, { TreeNode } from 'rc-tree';

import { Icon } from 'components/Base';

import 'rc-tree/assets/index.css';

import styles from './index.scss';

@translate()
@observer
export default class Tree extends Component {
  static propTypes = {
    checkable: PropTypes.bool,
    keyName: PropTypes.string,
    onSelect: PropTypes.func,
    sameHeight: PropTypes.bool,
    showIcon: PropTypes.bool,
    showLine: PropTypes.bool,
    treeData: PropTypes.array
  };

  static defaultProps = {
    checkable: false,
    sameHeight: false,
    showIcon: false,
    showLine: false,
    keyName: 'key',
    treeData: [],
    onSelect: _.noop
  };

  renderSwitcherIcon = ({ expanded, isLeaf }) => {
    if (isLeaf) {
      return null;
    }
    return <Icon name={expanded ? 'caret-down' : 'caret-right'} type="dark" />;
  };

  renderTitle = node => {
    const { renderTreeTitle, t } = this.props;
    if (_.isFunction(renderTreeTitle)) {
      return renderTreeTitle(node);
    }

    return typeof node.title === 'string' ? t(node.title) : node.title;
  };

  renderTreeNodes = data => data.map(node => (
      <TreeNode key={node.key} {...node} title={this.renderTitle(node)}>
        {node.children && this.renderTreeNodes(node.children)}
      </TreeNode>
  ));

  render() {
    const {
      className,
      checkable,
      hoverLine,
      sameHeight,
      switcherIcon,
      children,
      treeData,
      ...resetProps
    } = this.props;

    return (
      <RcTree
        className={classnames(
          styles.tree,
          {
            [styles.hoverTree]: hoverLine,
            [styles.autoHeight]: !sameHeight
          },
          className
        )}
        checkable={checkable ? <span className="checkbox-inner" /> : checkable}
        switcherIcon={switcherIcon || this.renderSwitcherIcon}
        {...resetProps}
      >
        {children || this.renderTreeNodes(treeData)}
      </RcTree>
    );
  }
}

export { TreeNode };
