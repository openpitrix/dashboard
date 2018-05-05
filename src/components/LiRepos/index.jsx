import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.scss';

export default class LiRepos extends PureComponent {
  static propTypes = {
    reposData: PropTypes.array,
    reposType: PropTypes.oneOf(['Public', 'Private'])
  };

  render() {
    const { reposData, reposType } = this.props;
    return (
      <ul className={classNames(styles.reposList, { [styles.reposBg]: reposType === 'Public' })}>
        {reposData.map((data, index) => (
          <li key={index}>
            <img className={styles.icon} src={data.icon || 'http://via.placeholder.com/24x24'} />
            <span className={styles.name}>{data.name}</span>
            <span className={styles.total}>
              <span className={styles.number}>{data.total}</span>
              Clusters
            </span>
          </li>
        ))}
      </ul>
    );
  }
}
