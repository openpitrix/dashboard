import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { I18n } from 'react-i18next';

import Header from 'components/Header';
import Footer from 'components/Footer';

import styles from './index.scss';

const NotFound = () => (
  <I18n>
    {t => (
      <Fragment>
        <Header alwaysShow />
        <div className={styles.notFound}>
          <div className={styles.content}>
            <h1>404</h1>
            <p className={styles.noteWord}>
              {t('Sorry, the page you visited does not exist')}
            </p>
            <Link to="/" className={styles.back}>
              {t('Back home')}
            </Link>
          </div>
        </div>
        <Footer />
      </Fragment>
    )}
  </I18n>
);

export default NotFound;
