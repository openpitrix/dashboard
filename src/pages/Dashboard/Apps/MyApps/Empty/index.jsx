import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import { Button } from 'components/Base';
import routes, { toRoute } from 'routes';

import styles from './index.scss';

@withTranslation()
export default class Loading extends PureComponent {
  render() {
    const { t } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.title}>{t('APPS_EMPTY_TITLE')}</div>
          <div className={styles.description}>{t('APPS_EMPTY_DESCRIBER')}</div>
          <div className={styles.btn}>
            <Link to={toRoute(routes.portal._dev.appCreate)}>
              <Button data-cy="createApp" type="primary">
                {t('Create the first app')}
              </Button>
            </Link>
          </div>
          <div className={styles.tips}>
            <span className={styles.tipsInfo}>{t('Tips')}</span>
            <span>{t('APPS_EMPTY_TIPS01')}</span>
            <Link to={'/'}>{t('APPS_EMPTY_TIPS02')}</Link>。
          </div>
        </div>
      </div>
    );
  }
}
