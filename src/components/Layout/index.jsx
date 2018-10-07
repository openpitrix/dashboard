import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { inject } from 'mobx-react';
import { noop, clone, isEmpty, get } from 'lodash';

import { Notification } from 'components/Base';
import TabsNav from 'components/TabsNav';
import Menu from 'components/Menu';
import Loading from 'components/Loading';
import TitleBanner from './TitleBanner';

import styles from './index.scss';

@inject(({ rootStore, sock }) => ({
  user: rootStore.user,
  sock
}))
export default class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    noNotification: PropTypes.bool,
    backBtn: PropTypes.node,
    isLoading: PropTypes.bool,
    loadClass: PropTypes.string,
    listenToJob: PropTypes.func,
    title: PropTypes.string,
    hasSearch: PropTypes.bool,
    noLogin: PropTypes.bool
  };

  static defaultProps = {
    msg: '',
    noNotification: false,
    backBtn: null,
    listenToJob: noop,
    title: '',
    hasSearch: false,
    noLogin: false
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

  render() {
    const {
      className,
      noNotification,
      children,
      isLoading,
      loadClass,
      backBtn,
      hasSearch,
      title,
      noLogin
    } = this.props;

    const { isNormal, isDev, isAdmin } = this.props.user;
    const hasMenu = (isDev || isAdmin) && !noLogin;

    return (
      <div
        className={classnames(
          styles.layout,
          className,
          { [styles.hasMenu]: hasMenu },
          { [styles.hasBack]: Boolean(backBtn) }
        )}
      >
        {isNormal && <TitleBanner title={title} hasSearch={hasSearch} />}
        {hasMenu && <Menu />}
        {noNotification ? null : <Notification />}
        {backBtn}
        <Loading isLoading={isLoading} className={styles[loadClass]}>
          {children}
        </Loading>
      </div>
    );
  }
}
