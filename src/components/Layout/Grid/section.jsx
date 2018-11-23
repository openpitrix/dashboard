import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { getCookie } from 'utils';

import styles from './index.scss';

const Section = ({
  size, offset, className, children, ...rest
}) => {
  const isDev = getCookie('role') !== 'user';
  const sizeCls = `section-size-${isDev ? `dev-${size}` : size}`;
  const offsetCls = `section-offset-${isDev ? `dev-${offset}` : offset}`;

  return (
    <div
      className={classnames(styles.section, sizeCls, offsetCls, className)}
      {...rest}
    >
      {children}
    </div>
  );
};

Section.propTypes = {
  offset: PropTypes.number,
  size: PropTypes.number
};

Section.defaultProps = {
  size: 4,
  offset: 0
};

export default Section;
