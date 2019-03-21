import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';

import { Icon } from 'components/Base';
import routes, { toRoute } from 'routes';

import styles from './index.scss';

const NavItem = ({
  className,
  to,
  iconProps,
  iconLinkCls,
  label,
  hoverLabel,
  children,
  wrapLabelInLink,
  wrapIconInLink,
  hasBack,
  ...rest
}) => {
  const labelElem = <label className={styles.title}>{label}</label>;
  const childElem = children || (
    <Icon className={styles.icon} size={20} type="dark" {...iconProps} />
  );

  if (hasBack) {
    return (
      <li className={classnames(styles.navItem, className)} {...rest}>
        <div className={styles.hoverHide}>
          {childElem} {labelElem}
        </div>
        <div className={styles.hoverShow}>
          <NavLink to={to} className={iconLinkCls}>
            <Icon className={styles.icon} size={20} type="dark" name="back" />
          </NavLink>
          <NavLink to={to} exact>
            <label className={styles.title}>{hoverLabel}</label>
          </NavLink>
        </div>
      </li>
    );
  }

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
  hasBack: PropTypes.bool,
  iconProps: PropTypes.object,
  to: PropTypes.string,
  wrapIconInLink: PropTypes.bool,
  wrapLabelInLink: PropTypes.bool
};

NavItem.defaultProps = {
  iconProps: {},
  to: '',
  wrapIconInLink: true,
  hasBack: false
};

export default NavItem;
