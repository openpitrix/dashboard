import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import styles from './index.scss';

const TAB_NAME = 'DetailTabs';

const Panel = ({ className, children, ...rest }) => (
  <div
    className={classnames(
      styles.panel,
      {
        [styles.paddingTop0]:
          _.get(children, '[0].type.displayName') === TAB_NAME
      },
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

Panel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

Panel.defaultProps = {};

export default Panel;
