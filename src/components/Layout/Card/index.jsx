import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Panel from '../Panel';

import styles from './index.scss';

const Card = ({ className, children, ...others }) => (
  <Panel className={classnames(styles.card, className)} {...others}>
    {children}
  </Panel>
);

Card.propTypes = {
  className: PropTypes.string
};

export default Card;
