import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

const Panel = ({ className, children, ...rest }) => (
  <div className={classnames(styles.panel, className)} {...rest}>
    {children}
  </div>
);

Panel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

Panel.defaultProps = {};

export default Panel;
