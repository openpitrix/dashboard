import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

const LayoutLeft = ({ className, column, children }) => (
  <div className={classnames(styles['layout-left-' + column], className)}>{children}</div>
);

LayoutLeft.defaultProps = {
  column: 4
};

LayoutLeft.propTypes = {
  className: PropTypes.string,
  column: PropTypes.number,
  children: PropTypes.node
};

export default LayoutLeft;
