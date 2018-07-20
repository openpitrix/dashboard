import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

const Section = ({ size, offset, className, children, ...rest }) => {
  return (
    <div
      className={classnames(
        styles.section,
        `section-size-${size}`,
        `section-offset-${offset}`,
        className,
        ...rest
      )}
    >
      {children}
    </div>
  );
};

Section.propTypes = {
  size: PropTypes.number,
  offset: PropTypes.number
};

Section.defaultProps = {
  size: 4,
  offset: 0
};

export default Section;
