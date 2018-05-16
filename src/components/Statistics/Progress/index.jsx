import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classnames from 'classnames';

export default class Progress extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };
  calLeft = (index, progress) => {
    let sum = 0;
    for (let i = 0; i < index; i++) {
      sum += progress[i];
    }
    return sum;
  };

  render() {
    const { progress } = this.props;

    return (
      <div className={styles.progress}>
        {progress.map((data, index) => (
          <div
            className={styles.inner}
            key={index}
            style={{ width: data + '%', left: this.calLeft(index, progress) + '%' }}
          />
        ))}
      </div>
    );
  }
}
