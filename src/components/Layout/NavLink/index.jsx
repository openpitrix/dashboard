import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

const NavLink = ({ className, children }) => (
  <div className={classnames(styles.navLink, className)}>{children}</div>
);

NavLink.propTypes = {
  children: PropTypes.node
};

export default NavLink;
