import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import { Link } from 'react-router-dom';
import { I18n } from 'react-i18next';
import { __ } from 'hoc/trans';

import styles from './index.scss';

const BackBtn = ({ label, link }) => {
  const transLabel = __(capitalize(label));

  return (
    <I18n>
      {t => (
        <div className={styles.backTo}>
          <Link to={link}>{__('Back to link', { link: transLabel })}</Link>
        </div>
      )}
    </I18n>
  );
};

BackBtn.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};

export default BackBtn;
