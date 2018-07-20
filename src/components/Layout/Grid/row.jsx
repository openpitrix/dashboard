import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

const Row = ({ className, children, ...rest }) => {
  return <div className={classnames(styles.row, className, ...rest)}>{children}</div>;
};

Row.propTypes = {
  className: PropTypes.string
};

export default Row;
