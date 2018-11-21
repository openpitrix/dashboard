import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { inject } from 'mobx-react';

import { Image } from 'components/Base';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  user: rootStore.user
}))
export default class AppImages extends Component {
  static propTypes = {
    apps: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  static defaultProps = {
    apps: [],
    total: 0
  };

  render() {
    const {
      apps, total, user, t
    } = this.props;

    return (
      <div className={styles.appImages}>
        <div className={styles.name}>{t('Apps')}</div>
        <div className={styles.images}>
          {apps.slice(0, 10).map(({ app_id, icon, name }) => (
            <Link
              className={styles.image}
              key={app_id}
              to={user.isDev ? `/dashboard/app/${app_id}` : `/store/${app_id}`}
              title={name}
            >
              <Image src={icon} iconLetter={name} className={styles.img} />
            </Link>
          ))}
          <span className={styles.totalNum}>{total}</span>
        </div>
      </div>
    );
  }
}
