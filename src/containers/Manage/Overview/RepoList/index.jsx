import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.scss';

export default class RepoList extends PureComponent {
  static propTypes = {
    repos: PropTypes.array,
    type: PropTypes.oneOf(['Public', 'Private'])
  };

  render() {
    const { repos, type } = this.props;
    return (
      <ul className={classNames(styles.reposList, { [styles.reposBg]: type == 'Public' })}>
        {repos.map(data => (
          <li key={data.repo_id}>
            <img className={styles.icon} src={data.icon} />
            <span className={styles.name}>{data.provider}</span>
            <span className={styles.total}>
              <span className={styles.number}>{data.total || 0}</span>
              Clusters
            </span>
          </li>
        ))}
      </ul>
    );
  }
}
