import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Section from './section';
import Row from './row';

import styles from './index.scss';

const Grid = ({ className, children, ...rest }) => (
  <div className={classnames(styles.container, className)} {...rest}>
    {children}
  </div>
);

Grid.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

Grid.defaultProps = {};

Grid.Section = Section;
Grid.Row = Row;
export default Grid;
