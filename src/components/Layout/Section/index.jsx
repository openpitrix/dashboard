import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

const Section = ({ className, children }) => (
  <div className={classnames(styles.section, className)}>{children}</div>
);

Section.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

export default Section;
