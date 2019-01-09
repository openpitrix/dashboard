import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import { Icon } from 'components/Base';

import styles from './index.scss';

const isNavLinkActive = (cate_id, match, location) => location.pathname.indexOf(cate_id) > -1;

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
        <p className={styles.caption}>{t('Categories')}</p>
        <ul className={styles.subNav}>
          {navs.map(({ category_id, name, description }) => (
            <li key={category_id} className={styles.item}>
              <NavLink
                to={`/?cate=${category_id}`}
                activeClassName={styles.current}
                isActive={isNavLinkActive.bind(null, category_id)}
              >
                <Icon
                  name={description}
                  size={24}
                  type="dark"
                  className={styles.icon}
                />
                <span className={styles.name}>{t(name)}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
