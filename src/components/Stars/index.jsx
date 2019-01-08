import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon } from 'components/Base';

import styles from './index.scss';

const stars = [1, 2, 3, 4, 5];

export default class Stars extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    starTotal: PropTypes.number
  };

  static defaultProps = {
    starTotal: 5
  };

  render() {
    const { className, starTotal } = this.props;

    return (
      <div className={classnames(styles.stars, className)}>
        {stars.map(star => (
          <Icon
            key={star}
            name="star"
            size={16}
            type="dark"
            className={classnames({
              [styles.yellow]: starTotal >= star
            })}
          />
        ))}
      </div>
    );
  }
}
