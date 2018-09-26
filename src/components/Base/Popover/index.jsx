import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Tooltip from '../Tooltip';
import styles from './index.scss';

export default class Popover extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    trigger: PropTypes.string,
    placement: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
    visible: PropTypes.bool,
    showBorder: PropTypes.bool,
    onVisibleChange: PropTypes.func
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
