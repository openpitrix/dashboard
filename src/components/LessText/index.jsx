import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Translation } from 'react-i18next';

import styles from './index.scss';

const LessText = ({ txt, limit, className }) => (
  <Translation>
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
  </Translation>
);

LessText.propTypes = {
  limit: PropTypes.number,
  txt: PropTypes.string
};

export default LessText;
