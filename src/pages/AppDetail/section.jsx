import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

const Section = ({
  title, children, className, contentClass, ...rest
}) => (
  <div className={classnames(styles.section, className)} {...rest}>
    {title && <div className={styles.title}>{title}</div>}
    <div className={classnames(styles.content, contentClass)}>{children}</div>
  </div>
);

Section.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  contentClass: PropTypes.string,
  title: PropTypes.string
};

Section.defaultProps = {
  title: ''
};

export default Section;
