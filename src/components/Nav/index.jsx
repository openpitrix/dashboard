import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { get } from 'lodash';

import styles from './index.scss';

export default class Nav extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    navs: PropTypes.array,
    curCategory: PropTypes.string,
    onChange: PropTypes.func
  };

  changeValue = (id, name) => {
    this.props.onChange({ category_id: id }, name);
  };

  render() {
    const { className, navs, curCategory } = this.props;
    return (
      <div className={classnames(styles.nav, className)}>
        <ul className={styles.subNav}>
          <p>CATEGORIES</p>
          {navs &&
            navs.map(nav => (
              <li
                key={nav.category_id}
                className={classnames({
                  [styles.current]: nav.category_id === curCategory
                })}
              >
                <a
                  onClick={() => {
                    this.changeValue(nav.category_id, nav.name);
                  }}
                >
                  {nav.name}
                </a>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
