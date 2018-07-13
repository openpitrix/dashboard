import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import trans, { __ } from 'hoc/trans';
import { ucfirst } from 'utils/string';

import styles from './index.scss';

@trans()
export default class RepoList extends PureComponent {
  static propTypes = {
    repos: PropTypes.array,
    type: PropTypes.oneOf(['public', 'private', 'runtime']),
    limit: PropTypes.number
  };

  static defaultProps = {
    limit: 3,
    type: 'public',
    repos: []
  };

  render() {
    const { repos, type, limit } = this.props;
    let filterRepos = repos,
      totalName = 'Clusters';

    if (type !== 'runtime') {
      filterRepos = repos.filter(repo => repo.visibility === type).slice(0, limit);
      totalName = 'Apps';
    }

    return (
      <Fragment>
        {type !== 'runtime' && <div className={styles.type}>{__(ucfirst(type))}</div>}
        <ul
          className={classNames(
            styles.reposList,
            { [styles.reposBg]: type === 'public' },
            { [styles.runtimeBg]: type === 'runtime' }
          )}
        >
          {filterRepos.map(item => {
            let link = `/dashboard/repo/${item.repo_id}`;
            let total = item.clusters && item.clusters.length;
            if (type !== 'runtime') {
              link = `/dashboard/repo/${item.repo_id}`;
              total = item.apps && item.apps.length;
            }
            return (
              <li key={item.repo_id || item.runtime_id}>
                <Link to={link}>
                  <img className={styles.icon} src={item.icon} />
                  <span className={styles.name}>{item.name}</span>
                  <span className={styles.total}>
                    <span className={styles.number}>{total || 0}</span>
                    {__(totalName)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Fragment>
    );
  }
}
