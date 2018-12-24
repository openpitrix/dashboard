import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import RcTree, { TreeNode } from 'rc-tree';

import { Icon } from 'components/Base';

import 'rc-tree/assets/index.css';
import styles from './index.scss';

export default class Tree extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    sameHeight: PropTypes.bool,
    showIcon: PropTypes.bool,
    showLine: PropTypes.bool,
    treeData: PropTypes.array
  };

  static defaultProps = {
    sameHeight: false,
    showIcon: false,
    showLine: false,
    treeData: [],
    onSelect: _.noop
  };

  renderSwitcherIcon = ({ expanded, isLeaf }) => {
    if (isLeaf) {
      return null;
    }
    return <Icon name={expanded ? 'caret-down' : 'caret-right'} type="dark" />;
  };

  render() {
    const {
      className, hoverLine, sameHeight, ...resetProps
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
        switcherIcon={this.renderSwitcherIcon}
        {...resetProps}
      />
    );
  }
}

export { TreeNode };
