import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Translation } from 'react-i18next';

import Header from 'components/Header';
import Footer from 'components/Footer';

import styles from './index.scss';

const NotFound = () => (
  <Translation>
    {t => (
      <Fragment>
        <Header />
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
  </Translation>
);

export default NotFound;
