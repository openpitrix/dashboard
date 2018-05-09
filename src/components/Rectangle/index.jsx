import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AppImgs from '../Rectangle/AppImgs';
import styles from './index.scss';

export default class Card extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    idNo: PropTypes.string,
    description: PropTypes.string,
    imgArray: PropTypes.array,
    id: PropTypes.string
  };

  render() {
    const { title, idNo, description, imgArray, id } = this.props;
    return (
      <div className={styles.rectangle}>
        <div className={styles.title}>
          <Link to={`/manage/categories/${id}`}>{title}</Link>
        </div>
        <div className={styles.idNo}>{idNo}</div>
        <div className={styles.description}>{description}</div>
        <AppImgs imgArray={imgArray} />
      </div>
    );
  }
}
