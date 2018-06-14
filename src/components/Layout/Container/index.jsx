import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

const Container = ({ className, children }) => (
  <div className={classnames(styles.container, className)}>{children}</div>
);

Container.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

export default Container;
