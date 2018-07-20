import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Panel from '../Panel';

import styles from './index.scss';

const Card = ({ className, children }) => (
  <Panel className={classnames(styles.card, className)}>{children}</Panel>
);

Card.propTypes = {
  className: PropTypes.string
};

export default Card;
