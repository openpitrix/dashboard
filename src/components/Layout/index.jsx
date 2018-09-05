import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { inject } from 'mobx-react';
import { noop, clone, isEmpty, get } from 'lodash';

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
    listenToJob: PropTypes.func,
    isProfile: PropTypes.bool
  };

  static defaultProps = {
    msg: '',
    noTabs: false,
    noNotification: false,
    backBtn: null,
    listenToJob: noop,
    isProfile: false
  };

  constructor(props) {
    super(props);
    this.availableLinks = [];
    this.linkPrefix = '/dashboard';
  }

  componentDidMount() {
    const { sock, listenToJob } = this.props;

    sock &&
      sock.on('ops-resource', (payload = {}) => {
        const { type } = payload;
        const { resource = {} } = payload;

        listenToJob({
          op: `${type}:${resource.rtype}`,
          type,
          ...resource
        });
      });
  }

  componentWillUnmount() {
    const { sock } = this.props;

    if (sock && !isEmpty(sock._events)) {
      sock._events = {};
    }
  }

  renderTabs(isProfile) {
    const loginRole = getSessInfo('role', this.props.sessInfo);
    const normalLinks = [{ '': 'overview' }, 'apps', 'clusters', 'runtimes'];
    if (isProfile) {
      this.linkPrefix = '/profile';
      this.availableLinks = [{ '': 'profile' }, { ssh_keys: 'SSH Keys' }];
    } else if (loginRole === 'normal') {
      this.availableLinks = [...normalLinks];
      this.availableLinks.splice(1, 1);
    } else if (loginRole === 'developer') {
      this.availableLinks = [...normalLinks, 'repos'];
    } else if (loginRole === 'admin') {
      this.availableLinks = [...normalLinks, 'repos', 'categories', 'users'];
    }

    const options = { prefix: this.linkPrefix };

    return <TabsNav links={this.availableLinks} options={options} />;
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
        <Loading isLoading={isLoading} className={styles[loadClass]}>
          {children}
        </Loading>
      </div>
    );
  }
}
