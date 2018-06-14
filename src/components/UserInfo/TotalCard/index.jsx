import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { imgPlaceholder } from 'src/utils';

import styles from './index.scss';

export default class TotalCard extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    name: PropTypes.string,
    total: PropTypes.number
  };

  static defaultProps = {
    icon: imgPlaceholder()
  };

  render() {
    const { icon, name, total, ...rest } = this.props;

    return (
      <div className={styles.totalCard} {...rest}>
        <div className={styles.name}>
          <img src={icon} />
          {name}
        </div>
        <div className={styles.number}>{total}</div>
      </div>
    );
  }
}
