import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import { Image } from 'components/Base';

import styles from './index.scss';

@translate()
export default class AppImages extends Component {
  static propTypes = {
    apps: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  };

  render() {
    const { apps, total, t } = this.props;
    const nonIcon = '/none.svg';

    return (
      <div className={styles.appImages}>
        <div className={styles.name}>{t('Apps')}</div>
        <div className={styles.images}>
          {apps &&
            apps.slice(0, 10).map(({ app_id, icon, name }) => (
              <Link
                className={styles.image}
                key={app_id}
                to={`/dashboard/app/${app_id}`}
                title={name}
              >
                <Image src={icon || nonIcon} />
              </Link>
            ))}
          <span className={styles.totalNum}>{total}</span>
        </div>
      </div>
    );
  }
}
