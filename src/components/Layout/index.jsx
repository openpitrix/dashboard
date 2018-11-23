import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { inject } from 'mobx-react';
import {
  noop, clone, isEmpty, get
} from 'lodash';

import { Notification, Icon } from 'components/Base';
import Loading from 'components/Loading';
import { getScrollTop } from 'src/utils';
import TitleBanner from './TitleBanner';
import SideNav from './SideNav';

import styles from './index.scss';

@inject(({ rootStore, sock }) => ({
  user: rootStore.user,
  sock
}))
class Layout extends Component {
  static propTypes = {
    backBtn: PropTypes.node,
    children: PropTypes.node,
    className: PropTypes.string,
    hasSearch: PropTypes.bool,
    isHome: PropTypes.bool,
    isLoading: PropTypes.bool,
    listenToJob: PropTypes.func,
    loadClass: PropTypes.string,
    noNotification: PropTypes.bool,
    pageTitle: PropTypes.string,
    title: PropTypes.string
  };

  static defaultProps = {
    noNotification: false,
    backBtn: null,
    listenToJob: noop,
    title: '',
    pageTitle: '',
    hasSearch: false,
    isHome: false
  };

  state = {
    isScroll: false
  };

  componentDidMount() {
    const { sock, listenToJob } = this.props;

    sock
      && sock.on('ops-resource', (payload = {}) => {
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
    scrollTop > 0
      ? this.setState({ isScroll: true })
      : this.setState({ isScroll: false });
  };

  goBack = () => {
    const { history } = this.props;
    history.goBack();
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
      isHome,
      match,
      pageTitle
    } = this.props;

    const { isNormal, isDev, isAdmin } = this.props.user;
    const hasMenu = (isDev || isAdmin) && !isHome;
    const { isScroll } = this.state;
    const paths = ['/dashboard', '/profile', '/ssh_keys', '/dev/apps'];
    const isCenterPage = Boolean(pageTitle); // detail page, only one level menu
    const hasSubNav = hasMenu && !isCenterPage && !paths.includes(match.path);

    return (
      <div
        className={classnames(
          styles.layout,
          className,
          { [styles.hasMenu]: hasSubNav },
          { [styles.hasNav]: hasMenu && !hasSubNav },
          { [styles.hasBack]: Boolean(backBtn) },
          { [styles.detailPage]: isCenterPage }
        )}
      >
        {noNotification ? null : <Notification />}
        {backBtn}

        {hasMenu && <SideNav isScroll={isScroll} hasSubNav={hasSubNav} />}
        {isNormal
          && !isHome && <TitleBanner title={title} hasSearch={hasSearch} />}

        {isCenterPage && (
          <div className={styles.pageTitle}>
            <div className={styles.title}>
              <Icon
                onClick={this.goBack}
                name="previous"
                size={20}
                type="dark"
                className={styles.icon}
              />
              {pageTitle}
            </div>
          </div>
        )}

        <Loading isLoading={isLoading} className={styles[loadClass]}>
          {isCenterPage ? (
            <div className={styles.centerPage}>{children}</div>
          ) : (
            children
          )}
        </Loading>
      </div>
    );
  }
}

export default withRouter(Layout);
