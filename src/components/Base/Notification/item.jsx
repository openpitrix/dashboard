import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop } from 'lodash';

import { Icon } from 'components/Base';

import styles from './index.scss';

export default class NotificationItem extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
    title: PropTypes.string,
    message: PropTypes.node,
    timeOut: PropTypes.number,
    onClick: PropTypes.func,
    onHide: PropTypes.func,
    onClosed: PropTypes.func,
    className: PropTypes.string,
    detach: PropTypes.func,
    ts: PropTypes.number
  };

  static defaultProps = {
    type: 'info',
    title: 'Notification',
    message: null,
    timeOut: 3000,
    onClick: noop,
    onHide: null,
    onClosed: noop,
    detach: noop,
    ts: Date.now()
  };

  timer = null;

  state = {
    hidden: false
  };

  // based on font-awesome icons
  iconMap = {
    error: 'error',
    success: 'information',
    info: 'information',
    warning: 'exclamation'
  };

  colorMap = {
    error: '#cf3939',
    success: '#15934e',
    info: '#1e6eeb',
    warning: '#ef762b'
  };

  hideNotify = () => {
    const { ts, detach, onHide } = this.props;

    this.setState({ hidden: true }, () => {
      // detach notification from mobx store
      detach(ts);

      onHide && onHide();
    });
  };

  componentDidMount() {
    const { timeOut } = this.props;
    if (timeOut) {
      this.timer = setTimeout(this.hideNotify, timeOut);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
    this.props.onClosed();
  }

  handleClick = e => {
    // this.hideNotify();
  };

  render() {
    const { type, message, className, ...rest } = this.props;
    const { hidden } = this.state;

    const colorStyles = {
      primary: '#fff',
      secondary: this.colorMap[type]
    };

    if (hidden) {
      return null;
    }

    return (
      <div
        className={classnames(styles.notification, styles[`notification-${type}`], className)}
        onClick={this.handleClick}
        ref={c => (this.target = c)}
      >
        <Icon name={this.iconMap[type]} size={18} color={colorStyles} />
        {message}
      </div>
    );
  }
}
