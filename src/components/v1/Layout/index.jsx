import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

const Layout = ({ className, children }) => {
  return <div className={classnames(styles.container, className)}>{children}</div>;
};

Layout.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

Layout.defaultProps = {
  className: ''
};

export Section from './Section';
export default Layout;
