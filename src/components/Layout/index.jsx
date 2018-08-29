import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { inject } from 'mobx-react';
import { noop } from 'lodash';

import { Notification } from 'components/Base';
import TabsNav from 'components/TabsNav';
import Loading from 'components/Loading';
import { getSessInfo } from 'src/utils';

import styles from './index.scss';

@inject('sessInfo', 'sock')
export default class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    noNotification: PropTypes.bool,
    noTabs: PropTypes.bool,
    backBtn: PropTypes.node,
    isLoading: PropTypes.bool,
    loadClass: PropTypes.string,
    sockMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    listenToJob: PropTypes.func,
    isProfile: PropTypes.bool
  };

  static defaultProps = {
    msg: '',
    noTabs: false,
    noNotification: false,
    backBtn: null,
    sockMessage: '',
    listenToJob: noop,
    isProfile: false
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

  renderTabs(isProfile) {
    const loginRole = getSessInfo('role', this.props.sessInfo);
    const normalLinks = [{ '': 'overview' }, 'apps', 'clusters', 'runtimes'];
    if (isProfile) {
      this.linkPrefix = '/profile';
      this.availableLinks = [{ '': 'profile' }, { sshkeys: 'SSH Keys' }];
    } else if (loginRole === 'normal') {
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
      backBtn,
      isProfile
    } = this.props;

    return (
      <div className={classnames(styles.layout, className, { [styles.noTabs]: noTabs })}>
        {noTabs ? null : this.renderTabs(isProfile)}
        {noNotification ? null : <Notification />}
        {backBtn}
        {this.renderSocketMessage()}
        <Loading isLoading={isLoading} className={styles[loadClass]}>
          {children}
        </Loading>
      </div>
    );
  }
}
