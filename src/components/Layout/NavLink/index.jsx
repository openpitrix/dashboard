import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import { inject } from 'mobx-react/index';
import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  user: rootStore.user
}))
@observer
export default class NavLink extends Component {
  static propTypes = {
    children: PropTypes.node,
    linkPath: PropTypes.string
  };

  static defaultProps = {
    linkPath: ''
  };

  render() {
    const { children, linkPath, user, t } = this.props;
    const paths = linkPath.split('>');
    const linkLen = paths.length - 1;

    const pathToLink = {
      Dashboard: '/dashboard',
      Store: '/dashboard/apps',
      'All Apps': '/dashboard/apps',
      'App Reviews': '/dashboard/reviews',
      Categories: '/dashboard/categories',
      Platform: '/dashboard/repos',
      Repos: '/dashboard/repos',
      Runtimes: user.isDev ? '/runtimes' : '/dashboard/runtimes',
      'All Clusters': '/dashboard/clusters',
      Users: ' /dashboard/users',
      'All Users': '/dashboard/users',
      'My Apps': '/dashboard/apps',
      Test: '/dashboard/clusters'
    };

    return (
      <div className={styles.navLink}>
        {paths.map((path, index) => (
          <Fragment key={path}>
            {index !== linkLen && (
              <label>
                <Link to={pathToLink[path] || '/'}>{t(path)}</Link>&nbsp;/&nbsp;
              </label>
            )}
            {index === linkLen && <label>{t(path)}</label>}
          </Fragment>
        ))}
        {Boolean(children) && children}
      </div>
    );
  }
}
