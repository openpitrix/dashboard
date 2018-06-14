import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './index.scss';

const Panel = ({ title, linkTo, children }) => (
  <div className={styles.panel}>
    <div className={styles.title}>
      {title}
      <Link className={styles.more} to={linkTo}>
        more...
      </Link>
    </div>
    {children}
  </div>
);

Panel.propTypes = {
  title: PropTypes.string,
  linkTo: PropTypes.string,
  children: PropTypes.node
};

export default Panel;
