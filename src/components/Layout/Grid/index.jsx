import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Section from './section';
import Row from './row';

import styles from './index.scss';

const Grid = ({ className, children, ...rest }) => {
  return (
    <div className={classnames(styles.container, className)} {...rest}>
      {children}
    </div>
  );
};

Grid.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

Grid.defaultProps = {};

Grid.Section = Section;
Grid.Row = Row;
export default Grid;
