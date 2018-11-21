import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import { Link } from 'react-router-dom';
import { I18n } from 'react-i18next';

import styles from './index.scss';

const BackBtn = ({ label, link }) => (
  <I18n>
    {t => (
      <div className={styles.backBtn}>
        <Link to={link}>
          {t('Back to link', { link: t(capitalize(label)) })}
        </Link>
      </div>
    )}
  </I18n>
);

BackBtn.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};

BackBtn.defaultProps = {
  label: '',
  link: ''
};

export default BackBtn;
