import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { inject } from 'mobx-react';
import { noop } from 'lodash';

import NotificationManager from 'components/Base/Notification/manager';
import TabsNav from 'components/TabsNav';
import Loading from 'components/Loading';
import { getSessInfo } from 'src/utils';

import styles from './index.scss';

@inject('sessInfo', 'sock')
export default class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,

    // msg: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    // msgType: PropTypes.oneOf(['error', 'success', 'warning', 'error']),
    noNotification: PropTypes.bool,
    notifications: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),

    noTabs: PropTypes.bool,
    backBtn: PropTypes.node,
    isLoading: PropTypes.bool,
    loadClass: PropTypes.string,
    sockMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    listenToJob: PropTypes.func
  };

  static defaultProps = {
    msg: '',
    noTabs: false,
    noNotification: false,
    backBtn: null,
    sockMessage: '',
    listenToJob: noop,
    notifications: []
  };

  constructor(props) {
    super(props);
    this.availableLinks = [];
    this.linkPrefix = '/dashboard';
  }

  componentDidMount() {
    let { sock, listenToJob } = this.props;

    if (sock && !sock._events['ops-resource']) {
      sock.on('ops-resource', listenToJob);
    }
  }

  renderNotification() {
    if (this.props.noNotification) {
      return null;
    }

    let { notifications } = this.props;

    if (!Array.isArray(notifications)) {
      notifications = notifications.toJSON();
    }
    return <NotificationManager notifications={notifications} />;
  }

  renderTabs() {
    const loginRole = getSessInfo('role', this.props.sessInfo);
    const normalLinks = [{ '': 'overview' }, 'apps', 'clusters', 'runtimes'];

    if (loginRole === 'normal') {
      this.availableLinks = [...normalLinks];
      this.availableLinks.splice(1, 1);
    } else if (loginRole === 'developer') {
      this.availableLinks = [...normalLinks, 'repos'];
    } else if (loginRole === 'admin') {
      this.availableLinks = [...normalLinks, 'repos', 'categories']; // hide user tab
    }

    const options = { prefix: this.linkPrefix };

    return <TabsNav links={this.availableLinks} options={options} />;
  }

  renderSocketMessage() {
    let { sockMessage } = this.props;

    if (typeof sockMessage === 'object') {
      sockMessage = sockMessage + '';
    }

    // if(!sockMessage){
    //   return null;
    // }
    // return <Notification type='info' message={`Socket Message: ${sockMessage}`} className={styles.socketMessage} />;

    // todo: currently no need to implement job tips
    return null;
  }

  render() {
    const {
      className,
      noTabs,
      noNotification,
      children,
      isLoading,
      loadClass,
      backBtn
    } = this.props;

    return (
      <div className={classnames(styles.layout, className, { [styles.noTabs]: noTabs })}>
        {noTabs ? null : this.renderTabs()}
        {noNotification ? null : this.renderNotification()}
        {backBtn}
        {this.renderSocketMessage()}
        <Loading isLoading={isLoading} className={styles[loadClass]}>
          {children}
        </Loading>
      </div>
    );
  }
}
