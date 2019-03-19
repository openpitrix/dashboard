import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { Notification, Icon } from 'components/Base';
import Loading from 'components/Loading';
import SideNav from './SideNav';

import styles from './index.scss';

@withTranslation()
@inject(({ rootStore }) => ({
  rootStore,
  user: rootStore.user
}))
export class Layout extends Component {
  static propTypes = {
    backBtn: PropTypes.node,
    centerWidth: PropTypes.number,
    children: PropTypes.node,
    className: PropTypes.string,
    hasBack: PropTypes.bool,
    isCenterPage: PropTypes.bool,
    isHome: PropTypes.bool,
    isLoading: PropTypes.bool,
    loadClass: PropTypes.string,
    noNotification: PropTypes.bool,
    noSubMenu: PropTypes.bool,
    pageTitle: PropTypes.string,
    titleCls: PropTypes.string
  };

  static defaultProps = {
    noNotification: false,
    backBtn: null,
    pageTitle: '',
    noSubMenu: false,
    isHome: false,
    isCenterPage: false,
    hasBack: false,
    centerWidth: 1200
  };

  goBack = () => {
    const { history, hasBack } = this.props;
    if (hasBack) {
      history.goBack();
    }
  };

  renderTitle() {
    const {
      user, pageTitle, titleCls, hasBack, t
    } = this.props;

    if (!pageTitle || user.isNormal) {
      return null;
    }

    return (
      <div
        onClick={this.goBack}
        className={classnames(
          styles.pageTitle,
          { [styles.backTitle]: hasBack },
          titleCls
        )}
      >
        {hasBack && (
          <Icon name="back" size={24} type="dark" className={styles.backIcon} />
        )}
        {t(pageTitle)}
      </div>
    );
  }

  render() {
    const {
      className,
      noNotification,
      children,
      isLoading,
      loadClass,
      isHome,
      noSubMenu,
      isCenterPage,
      centerWidth,
      hasBack,
      user
    } = this.props;

    const hasMenu = !user.isNormal && !isHome;
    const hasSubNav = hasMenu && !noSubMenu && !hasBack;
    const maxWidth = isCenterPage || hasBack ? `${centerWidth}px` : '100%';

    return (
      <div
        className={classnames(
          styles.layout,
          {
            [styles.hasMenu]: hasSubNav,
            [styles.hasNav]: hasMenu && !hasSubNav
          },
          className
        )}
      >
        {!noNotification && <Notification />}
        {hasMenu && <SideNav hasSubNav={hasSubNav} />}
        <div
          className={classnames({
            [styles.centerPage]: isCenterPage || hasBack
          })}
          style={{ maxWidth }}
        >
          {this.renderTitle()}
          <Loading isLoading={isLoading} className={styles[loadClass]}>
            {children}
          </Loading>
        </div>
      </div>
    );
  }
}

export default withRouter(Layout);
