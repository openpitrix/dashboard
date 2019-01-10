import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import { getUrlParam } from 'utils/url';
import { Icon } from 'components/Base';

import styles from './index.scss';

@translate()
@withRouter
export default class Nav extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    navs: PropTypes.array
  };

  handleClick = cate_id => {
    this.props.history.push(`/cat/${cate_id}`);
  }

  render() {
    const { className, navs, t } = this.props;

    return (
      <div className={classnames(styles.nav, className)}>
        <p className={styles.caption}>{t('Categories')}</p>
        <ul className={styles.subNav}>
          {navs.map(({ category_id, name, description }) => (
            <li
              key={category_id}
              className={classnames(styles.item, {
                [styles.active]: getUrlParam('cate') === category_id
              })}
              onClick={() => this.handleClick(category_id)}
            >
              <Icon
                name={description}
                size={24}
                type="dark"
                className={styles.icon}
              />
              <span className={styles.name}>{t(name)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
