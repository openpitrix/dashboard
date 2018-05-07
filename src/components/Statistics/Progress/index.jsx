import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classnames from 'classnames';

export default class Histogram extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { progressArray } = this.props;

    function calLeft(index) {
      let sum = 0;
      for (let i = 0; i < index; i++) {
        sum += progressArray[i];
      }
      return sum;
    }

    return (
      <div className={styles.progress}>
        {progressArray.map((data, index) => (
          <div
            className={styles.inner}
            key={index}
            style={{ width: data + '%', left: calLeft(index) + '%' }}
          />
        ))}
      </div>
    );
  }
}
