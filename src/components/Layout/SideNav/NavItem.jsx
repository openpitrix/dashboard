import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

import { Icon } from 'components/Base';

import styles from './index.scss';

const NavItem = ({
  className,
  to,
  iconProps,
  iconLinkCls,
  label,
  children,
  wrapLabelInLink,
  wrapIconInLink,
  ...rest
}) => {
  const labelElem = <label className={styles.title}>{label}</label>;
  const childElem = children || <Icon className={styles.icon} {...iconProps} />;

  return (
    <li className={classnames(styles.navItem, className)} {...rest}>
      {wrapIconInLink ? (
        <NavLink to={to} className={iconLinkCls}>
          {childElem}
        </NavLink>
      ) : (
        childElem
      )}

      {wrapLabelInLink ? (
        <NavLink to={to} exact>
          {labelElem}
        </NavLink>
      ) : (
        labelElem
      )}
    </li>
  );
};

NavItem.propTypes = {
  iconProps: PropTypes.object,
  to: PropTypes.string,
  wrapIconInLink: PropTypes.bool,
  wrapLabelInLink: PropTypes.bool
};

NavItem.defaultProps = {
  iconProps: {
    size: 20,
    type: 'dark'
  },
  to: '',
  wrapIconInLink: true
};

export default NavItem;
