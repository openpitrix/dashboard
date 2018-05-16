import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

export default class TotalCard extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string,
    total: PropTypes.number
  };

  render() {
    const { icon, name, total } = this.props;

    return (
      <div className={styles.totalCard}>
        <div className={styles.name}>
          <img src={icon} />
          {name}
        </div>
        <div className={styles.number}>{total}</div>
      </div>
    );
  }
}
