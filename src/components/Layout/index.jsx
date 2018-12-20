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
    centerWidth: PropTypes.number,
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
    noSubMenu: PropTypes.bool,
    pageTitle: PropTypes.string
  };

  static defaultProps = {
    noNotification: false,
    backBtn: null,
    listenToJob: noop,
    pageTitle: '',
    hasSearch: false,
    noSubMenu: false,
    isHome: false,
    isCenterPage: false,
    hasBack: false,
    centerWidth: 1200
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
      hasSearch,
      isHome,
      noSubMenu,
      pageTitle,
      isCenterPage,
      centerWidth,
      hasBack
    } = this.props;

    const { isNormal } = this.props.user;
    const hasMenu = !isNormal && !isHome;
    const hasSubNav = hasMenu && !noSubMenu && !hasBack;

    if (isNormal) {
      return (
        <div className={classnames(styles.layout, className)}>
          {!noNotification && <Notification />}
          {Boolean(pageTitle) && (
            <TitleBanner title={pageTitle} hasSearch={hasSearch} />
          )}
          <Loading isLoading={isLoading} className={styles[loadClass]}>
            {children}
          </Loading>
        </div>
      );
    }

    return (
      <div
        className={classnames(
          styles.layout,
          className,
          { [styles.hasMenu]: hasSubNav },
          { [styles.hasNav]: hasMenu && !hasSubNav }
        )}
      >
        {!noNotification && <Notification />}

        {hasMenu && <SideNav hasSubNav={hasSubNav} />}

        <Loading isLoading={isLoading} className={styles[loadClass]}>
          <div
            className={classnames({
              [styles.centerPage]: isCenterPage || hasBack
            })}
            style={{ maxWidth: `${centerWidth}px` }}
          >
            {Boolean(pageTitle) && (
              <div className={styles.pageTitle}>
                {hasBack && (
                  <Icon
                    onClick={() => this.goBack()}
                    name="back"
                    size={24}
                    type="dark"
                    className={styles.backIcon}
                  />
                )}
                {pageTitle}
              </div>
            )}
            {children}
          </div>
        </Loading>
      </div>
    );
  }
}

export default withRouter(Layout);
