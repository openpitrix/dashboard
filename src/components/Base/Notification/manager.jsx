import React from 'react';
import PropType from 'prop-types';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

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
        <TransitionGroup>
          {notifications.map(item => (
            <CSSTransition
              unmountOnExit
              key={item.ts}
              timeout={500}
              classNames="slide-down"
            >
              <NotificationItem
                className={itemClass}
                {...item}
                detach={detachNotify}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    );
  }
}
