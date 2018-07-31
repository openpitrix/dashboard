import React from 'react';
import PropType from 'prop-types';
import classnames from 'classnames';

import Notification from './index';

import styles from './index.scss';

export default class NotificationManager extends React.Component {
  static propTypes = {
    notifications: PropType.array.isRequired,
    className: PropType.string
  };
  static defaultProps = {
    notifications: []
  };

  dettachNotify = () => {};

  render() {
    const { className, notifications, ...rest } = this.props;

    return (
      <div className={classnames(styles.wrapper, className)}>
        {notifications.map((notification, idx) => <Notification {...notification} key={idx} />)}
      </div>
    );
  }
}
