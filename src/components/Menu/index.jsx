import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link, NavLink } from 'react-router-dom';
import { inject, observer } from 'mobx-react/index';
import { translate } from 'react-i18next';

import { Icon, Popover } from 'components/Base';
import { getSessInfo } from 'src/utils';

import styles from './index.scss';

@translate()
@inject('rootStore', 'sessInfo')
@observer
export default class Menu extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {};

  renderOperateMenu = () => {
    const { t } = this.props;

    return (
      <ul className={styles.operateItems}>
        <li>
          <NavLink className={styles.line} to="/">
            {t('Back to User')}
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard">{t('Dashboard')}</NavLink>
        </li>
        <li>
          <NavLink to="/profile">{t('Profile')}</NavLink>
        </li>
        <li>
          <a href="/logout">{t('Log out')}</a>
        </li>
      </ul>
    );
  };

  renderSubNav() {
    return (
      <div className={styles.subNav}>
        <div className={styles.title}>Dashboard</div>
        <div className={styles.app}>
          <span className={styles.plus}>
            <Icon name="add" />
          </span>
          <span className={styles.more}>
            <Icon name="more" />
          </span>
        </div>
        <Link className={styles.link} to="/dashboard/repos">
          Repos
        </Link>
        <div className={styles.test}>
          <span className={styles.word}>Test</span>
        </div>
        <Link className={styles.link} to="/dashboard/clusters">
          Clusters
        </Link>
        <Link className={styles.link} to="/dashboard/runtimes">
          Runtimes
        </Link>
      </div>
    );
  }

  renderHeader() {
    const loggedInUser = getSessInfo('user', this.props.sessInfo);

    return (
      <div className={styles.header}>
        <Popover content={this.renderOperateMenu()} className={styles.role}>
          {loggedInUser}
          <Icon name="caret-down" className={styles.iconDark} type="dark" />
        </Popover>
      </div>
    );
  }
  ß;
  render() {
    return (
      <Fragment>
        <div className={styles.menu}>
          <ul className={styles.nav}>
            <li>
              <NavLink to="/" activeClassName={styles.active} exact>
                <Icon name="home" size={24} />
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" activeClassName={styles.active} exact>
                <Icon name="dashboard" size={24} />
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/apps" activeClassName={styles.active} exact>
                <Icon name="appcenter" size={24} />
              </NavLink>
            </li>
          </ul>
          {this.renderSubNav()}
        </div>
        {this.renderHeader()}
      </Fragment>
    );
  }
}
