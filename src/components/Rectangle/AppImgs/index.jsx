import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

export default class AppImgs extends Component {
  static propTypes = {
    imgArray: PropTypes.array,
    appToatal: PropTypes.number
  };
  render() {
    const { imgArray, appTotal } = this.props;
    return (
      <div className={styles.appImgs}>
        <div className={styles.name}>Apps</div>
        <div className={styles.imgList}>
          {imgArray && imgArray.map((img, index) => <img key={index} src={img} />)}
          <span className={styles.totalNum}>{appTotal}</span>
        </div>
      </div>
    );
  }
}
