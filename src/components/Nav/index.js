import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class Nav extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  };

  render() {
    const { className, navs } = this.props;

    return (
      <div className={classnames(styles.nav, className)}>
        {navs && navs.map(item => (
          <ul key={item.title} className={styles.subNav}>
            <p>{item.title.toUpperCase()}</p>
            {item.value.map(subItem => (
              <li key={subItem.value}>
                <a href={`#${subItem.value}`}>{subItem.title}</a>
              </li>
            ))}
          </ul>
        ))}
      </div>
    );
  }
}
