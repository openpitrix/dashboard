import React from 'react';
import PropType from 'prop-types';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';

import NotificationItem from './item';

import styles from './index.scss';

@inject('rootStore')
@observer
export default class NotificationManager extends React.Component {
  static propTypes = {
    className: PropType.string,
    itemClass: PropType.string
  };

  componentWillUnmount() {
    this.props.rootStore.notifications = [];
  }

  render() {
    const { className, itemClass, rootStore } = this.props;
    const { notifications, detachNotify } = rootStore;

    return (
      <div className={classnames(styles.wrapper, className)}>
        {notifications.map((notification, idx) => (
          <NotificationItem
            className={itemClass}
            {...notification}
            key={idx}
            detach={detachNotify}
          />
        ))}
      </div>
    );
  }
}
