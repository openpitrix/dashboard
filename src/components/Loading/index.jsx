import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './index.scss';

export default class Loading extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    className: 'loading'
  };

  render() {
    const { className } = this.props;
    return (
      <div className={styles[className]}>
        <div className={styles.loadOuter}>
          <div className={styles.loader} />
        </div>
      </div>
    );
  }
}
