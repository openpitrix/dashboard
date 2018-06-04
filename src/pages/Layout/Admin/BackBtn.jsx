import React from 'react';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import { Link } from 'react-router-dom';

import styles from './index.scss';

const BackBtn = ({ label, link }) => (
  <div className={styles.backTo}>
    <Link to={link}>← Back to {capitalize(label)}</Link>
  </div>
);

BackBtn.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};

export default BackBtn;
