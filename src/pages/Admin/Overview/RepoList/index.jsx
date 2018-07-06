import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { ucfirst } from 'utils/string';
import styles from './index.scss';

export default class RepoList extends PureComponent {
  static propTypes = {
    repos: PropTypes.array,
    type: PropTypes.oneOf(['public', 'private']),
    limit: PropTypes.number
  };

  static defaultProps = {
    limit: 3,
    type: 'public',
    repos: []
  };

  render() {
    const { repos, type, limit } = this.props;
    let filterRepos = repos.filter(repo => repo.visibility === type).slice(0, limit);

    return (
      <Fragment>
        <div className={styles.type}>{ucfirst(type)}</div>
        <ul className={classNames(styles.reposList, { [styles.reposBg]: type === 'public' })}>
          {filterRepos.map(data => (
            <li key={data.repo_id}>
              <Link to={`/dashboard/repo/${data.repo_id}`}>
                <img className={styles.icon} src={data.icon} />
                <span className={styles.name}>{data.providers && data.providers[0]}</span>
                <span className={styles.total}>
                  <span className={styles.number}>{(data.apps && data.apps.length) || 0}</span>
                  Apps
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Fragment>
    );
  }
}
