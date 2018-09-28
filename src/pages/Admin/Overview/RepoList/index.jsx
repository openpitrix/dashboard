import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import { ucfirst } from 'utils/string';
import { Icon } from 'components/Base';
import styles from './index.scss';

@translate()
export default class RepoList extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['public', 'private', 'runtime']),
    repos: PropTypes.array,
    runtimes: PropTypes.array,
    clusters: PropTypes.array,
    limit: PropTypes.number
  };

  static defaultProps = {
    type: 'public',
    repos: [],
    runtimes: [],
    clusters: [],
    limit: 2
  };

  render() {
    const { repos, runtimes, clusters, type, limit, t } = this.props;
    let filterItems = runtimes,
      totalName = 'Clusters';

    if (type !== 'runtime') {
      filterItems = repos.slice(0, limit).filter(repo => repo.visibility === type);
      totalName = 'Apps';
    }

    const isRepoList = type !== 'runtime' && filterItems.length > 0;

    return (
      <Fragment>
        {isRepoList && <div className={styles.type}>{t(ucfirst(type))}</div>}
        <ul className={classNames(styles.reposList, { [styles.reposBg]: type === 'public' })}>
          {filterItems.map(item => {
            let link = `/dashboard/runtime/${item.runtime_id}`;
            let provider = item.provider;
            let total = clusters.filter(cluster => item.runtime_id === cluster.runtime_id).length;

            if (type !== 'runtime') {
              link = `/dashboard/repo/${item.repo_id}`;
              provider = item.providers && item.providers[0];
              total = item.apps && item.apps.length;
            }

            return (
              <li key={item.repo_id || item.runtime_id}>
                <Link to={link}>
                  <Icon name={provider} size={24} className={styles.icon} type="dark" />
                  <span className={styles.name}>{item.name}</span>
                  <span className={styles.total}>
                    <span className={styles.number}>{total || 0}</span>
                    {t(totalName)}
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
