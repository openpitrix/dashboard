import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { I18n } from 'react-i18next';

import styles from './index.scss';

const LessText = ({ txt, limit, className }) => (
  <I18n>
    {t => {
      if (!txt) {
        return t('None');
      }
      if (txt.length > limit) {
        return (
          <span className={classnames(styles.txt, className)} title={txt}>
            {txt.substr(0, limit)}...
          </span>
        );
      }
      return <span className={classnames(styles.txt, className)}>{txt}</span>;
    }}
  </I18n>
);

LessText.propTypes = {
  limit: PropTypes.number,
  txt: PropTypes.string
};

export default LessText;
