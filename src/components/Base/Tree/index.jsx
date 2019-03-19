import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';

import RcTree, { TreeNode } from 'rc-tree';

import { Icon } from 'components/Base';

import styles from './index.scss';

@withTranslation()
@observer
export default class Tree extends Component {
  static propTypes = {
    checkable: PropTypes.bool,
    keyName: PropTypes.string,
    onSelect: PropTypes.func,
    prefixCls: PropTypes.string,
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
    onSelect: _.noop,
    prefixCls: 'op-tree'
  };

  renderSwitcherIcon = ({ expanded, isLeaf }) => {
    if (isLeaf) {
      return null;
    }
    return <Icon name={expanded ? 'caret-down' : 'caret-right'} type="dark" />;
  };

  get checkBox() {
    const { checkable, disabled } = this.props;
    if (!checkable || disabled) {
      return checkable;
    }

    return <Icon className="checkbox-inner" name="check" />;
  }

  renderTitle = node => {
    const { renderTreeTitle, t } = this.props;
    if (_.isFunction(renderTreeTitle)) {
      return renderTreeTitle(node);
    }

    return typeof node.title === 'string' ? t(node.title) : node.title;
  };

  renderTreeNodes = data => data.map(node => {
    const title = this.renderTitle(node);
    const hide = typeof title === 'undefined' || title === null;
    return (
        <TreeNode
          key={node.key}
          className={classnames({
            [styles.hide]: hide
          })}
          {...node}
          title={title}
        >
          {node.children && this.renderTreeNodes(node.children)}
        </TreeNode>
    );
  });

  render() {
    const {
      className,
      checkable,
      hoverLine,
      sameHeight,
      switcherIcon,
      children,
      treeData,
      showLine,
      ...restProps
    } = this.props;

    return (
      <RcTree
        className={classnames(
          styles.tree,
          {
            [styles.hoverTree]: hoverLine,
            [styles.autoHeight]: !sameHeight,
            [styles.showLine]: showLine
          },
          className
        )}
        checkable={this.checkBox}
        switcherIcon={switcherIcon || this.renderSwitcherIcon}
        {...restProps}
      >
        {children || this.renderTreeNodes(treeData)}
      </RcTree>
    );
  }
}

export { TreeNode };
