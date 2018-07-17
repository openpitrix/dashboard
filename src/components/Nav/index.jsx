import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import styles from './index.scss';

const isNavLinkActive = (cate_id, match, location) => {
  return location.pathname.indexOf(cate_id) > -1;
};

@translate()
export default class Nav extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    navs: PropTypes.array
  };

  render() {
    const { className, navs, t } = this.props;

    return (
      <div className={classnames(styles.nav, className)}>
        <ul className={styles.subNav}>
          <p>{t('Categories')}</p>
          {navs.map(nav => (
            <li key={nav.category_id}>
              <NavLink
                to={`/apps/${nav.category_id}`}
                activeClassName={styles.current}
                isActive={isNavLinkActive.bind(null, nav.category_id)}
              >
                {nav.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
