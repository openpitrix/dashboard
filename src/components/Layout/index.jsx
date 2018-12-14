import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { inject } from 'mobx-react';
import { noop, isEmpty } from 'lodash';

import { Notification, Icon } from 'components/Base';
import Loading from 'components/Loading';
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
    hasBack: PropTypes.bool,
    hasSearch: PropTypes.bool,
    isCenterPage: PropTypes.bool,
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
    noSubMenu: false,
    isHome: false,
    isCenterPage: false,
    hasBack: false
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
  }

  componentWillUnmount() {
    const { sock } = this.props;

    if (sock && !isEmpty(sock._events)) {
      sock._events = {};
    }
  }

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
      noSubMenu,
      pageTitle,
      isCenterPage,
      hasBack
    } = this.props;

    const { isNormal, isDev, isAdmin } = this.props.user;
    const hasMenu = (isDev || isAdmin) && !isHome;
    const paths = ['/dashboard', '/profile', '/ssh_keys'];

    const hasSubNav = hasMenu && !noSubMenu && !hasBack && !paths.includes(match.path);

    return (
      <div
        className={classnames(
          styles.layout,
          className,
          { [styles.hasMenu]: hasSubNav },
          { [styles.hasNav]: hasMenu && !hasSubNav },
          { [styles.hasBack]: Boolean(backBtn) }
        )}
      >
        {noNotification ? null : <Notification />}
        {backBtn}

        {hasMenu && <SideNav hasSubNav={hasSubNav} />}
        {isNormal
          && !isHome && <TitleBanner title={title} hasSearch={hasSearch} />}

        <Loading isLoading={isLoading} className={styles[loadClass]}>
          {isCenterPage || hasBack ? (
            <div className={styles.centerPage}>
              <div className={styles.pageTitle}>
                {hasBack && (
                  <Icon
                    onClick={() => this.goBack()}
                    name="previous"
                    size={24}
                    type="dark"
                    className={styles.backIcon}
                  />
                )}
                {pageTitle}
              </div>
              {children}
            </div>
          ) : (
            children
          )}
        </Loading>
      </div>
    );
  }
}

export default withRouter(Layout);
