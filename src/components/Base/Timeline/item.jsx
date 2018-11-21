import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class Item extends React.Component {
  static propTypes = {
    color: PropTypes.string,
    dot: PropTypes.oneOfType([PropTypes.node, PropTypes.element])
  };

  static defaultProps = {
    color: 'purple'
  };

  render() {
    const { color, dot, children } = this.props;

    return (
      <div className={styles.item}>
        <div
          className={classnames(styles.line, styles[color], {
            [styles.dotCustom]: dot
          })}
        >
          <span>{dot}</span>
        </div>
        {children}
      </div>
    );
  }
}
