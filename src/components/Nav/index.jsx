import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import styles from './index.scss';

const isNavLinkActive = (cate_id, match, location) => location.pathname.indexOf(cate_id) > -1;

@translate()
export default class Nav extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    navs: PropTypes.array,
    skipLink: PropTypes.string
  };

  static defaultProps = {
    skipLink: 'apps'
  };

  render() {
    const {
      className, navs, skipLink, t
    } = this.props;

    return (
      <div className={classnames(styles.nav, className)}>
        <p className={styles.caption}>{t('Categories')}</p>
        <ul className={styles.subNav}>
          {navs.map(nav => (
            <li key={nav.category_id}>
              <NavLink
                to={`/${skipLink}/category/${nav.category_id}`}
                activeClassName={styles.current}
                isActive={isNavLinkActive.bind(null, nav.category_id)}
              >
                {t(nav.name)}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
