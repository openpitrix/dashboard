import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

export default class Item extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    icon: PropTypes.string,
  };

  static defaultProps = {
    icon: 'refresh',
  }

  render() {
    const { icon, children } = this.props;

    return (
      <div className={styles.item}>
        <span className={styles.line}>
          <i className={`icon icon-${icon}`}></i>
        </span>
        {children}
      </div>
    );
  }
}
