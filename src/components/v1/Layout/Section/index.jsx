import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

const Section = ({ size, className, children }) => {
  return <div className={classnames(styles.section, className)}>{children}</div>;
};

Section.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

Section.defaultProps = {
  size: 4 // col span
};

export default Section;
