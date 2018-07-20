import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon } from 'components/Base';
import styles from './index.scss';

export default class Notification extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
    title: PropTypes.string,
    message: PropTypes.node,
    timeOut: PropTypes.number,
    onClick: PropTypes.func,
    onHide: PropTypes.func,
    onClosed: PropTypes.func
  };

  static defaultProps = {
    type: 'error',
    title: 'Notification',
    message: null,
    timeOut: 2000,
    onClick: () => {},
    onHide: () => {},
    onClosed: () => {}
  };

  timer = null;

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

  componentDidMount() {
    const { timeOut, onHide } = this.props;
    if (timeOut) {
      this.timer = setTimeout(onHide, timeOut);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
    this.props.onClosed();
  }

  handleClick = e => {};

  render() {
    const { type, message } = this.props;
    const className = classnames(styles.notification, styles[`notification-${type}`]);
    const colorStyles = {
      primary: '#fff',
      secondary: this.colorMap[type]
    };
    return (
      <div className={className} onClick={this.handleClick} ref={c => (this.target = c)}>
        <Icon name={this.iconMap[type]} size={18} color={colorStyles} />
        {message}
      </div>
    );
  }
}
