import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

const LayoutRight = ({ className, column, children }) => (
  <div className={classnames(styles['layout-right-' + column], className)}>{children}</div>
);

LayoutRight.defaultProps = {
  column: 8
};

LayoutRight.propTypes = {
  className: PropTypes.string,
  column: PropTypes.number,
  children: PropTypes.node
};

export default LayoutRight;
