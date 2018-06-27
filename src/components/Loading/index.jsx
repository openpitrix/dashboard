import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class Loading extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const { className } = this.props;
    return (
      <div className={classnames(styles.loading, className)}>
        <div className={styles.loadOuter}>
          <div className={styles.loader} />
        </div>
      </div>
    );
  }
}
