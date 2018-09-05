import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Panel from '../Panel';

import styles from './index.scss';

const Card = ({ className, children, hasTable = false, ...others }) => (
  <Panel
    className={classnames(styles.card, className, { [styles.tableCard]: hasTable })}
    {...others}
  >
    {children}
  </Panel>
);

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  hasTable: PropTypes.bool
};

export default Card;
