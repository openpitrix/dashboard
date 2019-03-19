import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import { Link } from 'react-router-dom';
import { Translation } from 'react-i18next';

import styles from './index.scss';

const BackBtn = ({ label, link }) => (
  <Translation>
    {t => (
      <div className={styles.backBtn}>
        <Link to={link}>
          {t('Back to link', { link: t(capitalize(label)) })}
        </Link>
      </div>
    )}
  </Translation>
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
