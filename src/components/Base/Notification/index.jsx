import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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
    type: 'info',
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
    info: 'info-circle',
    success: 'check-circle',
    warning: 'exclamation-circle',
    error: 'times-circle'
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
    const { type, title, message } = this.props;
    let icon = <i className={`fa fa-${this.iconMap[type]}`} />;
    const className = classnames(styles.notification, styles[`notification-${type}`]);

    return (
      <div className={className} onClick={this.handleClick} ref={c => (this.target = c)}>
        <span className={styles.title}>
          {icon} {title}
        </span>
        <div className={styles.message}>{message}</div>
      </div>
    );
  }
}
