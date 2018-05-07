import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class CardTitle extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    more: PropTypes.bool
  };

  render() {
    const { title, more } = this.props;
    return (
      <div className={classnames(styles.title)}>
        {title} <span className={classnames(styles.more, { [styles.show]: more })}>more...</span>
      </div>
    );
  }
}
