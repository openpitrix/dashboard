import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

export default class TdName extends PureComponent {
  static propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string
  };

  render() {
    const { image, name, description } = this.props;

    return (
      <span className={styles.tdName}>
        <img
          src={image || 'http://via.placeholder.com/24x24'}
          className={styles.image}
          alt="image"
        />
        <span className={styles.info}>
          <span className={styles.name}>{name}</span>
          <span className={styles.description}>{description}</span>
        </span>
      </span>
    );
  }
}
