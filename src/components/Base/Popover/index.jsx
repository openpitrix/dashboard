import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Tooltip from '../Tooltip';
import styles from './index.scss';

export default class Popover extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
    onVisibleChange: PropTypes.func,
    placement: PropTypes.string,
    prefixCls: PropTypes.string,
    showBorder: PropTypes.bool,
    title: PropTypes.string,
    trigger: PropTypes.string,
    visible: PropTypes.bool
  };

  static defaultProps = {
    prefixCls: 'pi-popover',
    trigger: 'click',
    placement: 'bottom',
    showBorder: false
  };

  getOverlay = () => {
    const { prefixCls, title, content } = this.props;

    return (
      <div>
        {title && <div className={`${prefixCls}-title`}>{title}</div>}
        <div className={`${prefixCls}-content`}>{content}</div>
      </div>
    );
  };

  render() {
    const { className, children, ...others } = this.props;

    return (
      <Tooltip
        {...others}
        className={classNames(styles.popover, className)}
        content={this.getOverlay()}
      >
        {children}
      </Tooltip>
    );
  }
}
