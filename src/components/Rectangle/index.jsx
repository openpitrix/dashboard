import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import AppImgs from '../Rectangle/AppImgs';
import styles from './index.scss';

export default class Card extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    idNo: PropTypes.string,
    description: PropTypes.string,
    imgArray: PropTypes.array
  };

  render() {
    const { title, idNo, description, imgArray } = this.props;
    return (
      <div className={styles.rectangle}>
        <div className={styles.title}>{title}</div>
        <div className={styles.idNo}>{idNo}</div>
        <div className={styles.description}>{description}</div>
        <AppImgs imgArray={imgArray} />
      </div>
    );
  }
}
