import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';
import { noop } from 'lodash';

import { Icon } from 'components/Base';

import styles from './index.scss';

@withTranslation()
export default class NotificationItem extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    detach: PropTypes.func,
    message: PropTypes.node,
    onClick: PropTypes.func,
    onClosed: PropTypes.func,
    onHide: PropTypes.func,
    timeOut: PropTypes.number,
    title: PropTypes.string,
    ts: PropTypes.number,
    type: PropTypes.oneOf(['info', 'success', 'warning', 'error'])
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

  state = {
    hidden: false
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

  hideNotify = () => {
    const { ts, detach, onHide } = this.props;

    this.setState({ hidden: true }, () => {
      // detach notification from mobx store
      detach(ts);

      onHide && onHide();
    });
  };

  handleClick = () => {
    // this.hideNotify();
  };

  render() {
    const {
      type, message, className, t
    } = this.props;
    const { hidden } = this.state;

    const colorStyles = {
      primary: '#fff',
      secondary: this.colorMap[type]
    };

    return (
      <div
        className={classnames(
          styles.notification,
          styles[`notification-${type}`],
          {
            [styles.hide]: hidden
          },
          className
        )}
        onClick={this.handleClick}
        ref={c => {
          this.target = c;
        }}
      >
        <Icon name={this.iconMap[type]} size={18} color={colorStyles} />
        {t(message)}
      </div>
    );
  }
}
