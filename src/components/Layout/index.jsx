import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { inject } from 'mobx-react';
import { noop, clone, isEmpty, get } from 'lodash';

import { Notification } from 'components/Base';
import Loading from 'components/Loading';
import TitleBanner from './TitleBanner';
import SideNav from './SideNav';
import { getScrollTop } from 'src/utils';

import styles from './index.scss';

@inject(({ rootStore, sock }) => ({
  user: rootStore.user,
  sock
}))
export default class Layout extends Component {
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
    isHome: PropTypes.bool
  };

  static defaultProps = {
    noNotification: false,
    backBtn: null,
    listenToJob: noop,
    title: '',
    hasSearch: false,
    isHome: false
  };

  state = {
    isScroll: false
  };

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

    window.onscroll = this.handleScroll;
  }

  componentWillUnmount() {
    const { sock } = this.props;

    if (sock && !isEmpty(sock._events)) {
      sock._events = {};
    }

    window.onscroll = null;
  }

  handleScroll = async () => {
    const scrollTop = getScrollTop();
    scrollTop > 0 ? this.setState({ isScroll: true }) : this.setState({ isScroll: false });
  };

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
      isHome
    } = this.props;

    const { isNormal, isDev, isAdmin } = this.props.user;
    const hasMenu = (isDev || isAdmin) && !isHome;
    const { isScroll } = this.state;

    return (
      <div
        className={classnames(
          styles.layout,
          className,
          { [styles.hasMenu]: hasMenu },
          { [styles.hasBack]: Boolean(backBtn) }
        )}
      >
        {hasMenu && <SideNav isScroll={isScroll} />}
        {noNotification ? null : <Notification />}

        {isNormal && !isHome && <TitleBanner title={title} hasSearch={hasSearch} />}
        {backBtn}

        <Loading isLoading={isLoading} className={styles[loadClass]}>
          {!isLoading && children}
        </Loading>
      </div>
    );
  }
}
