import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

export default class AppImages extends Component {
  static propTypes = {
    images: PropTypes.array,
    appTotal: PropTypes.number
  };
  render() {
    const { images, appTotal } = this.props;
    return (
      <div className={styles.appImages}>
        <div className={styles.name}>Apps</div>
        <div className={styles.images}>
          {images && images.map((img, index) => <img key={index} src={img} />)}
          <span className={styles.totalNum}>{appTotal}</span>
        </div>
      </div>
    );
  }
}
