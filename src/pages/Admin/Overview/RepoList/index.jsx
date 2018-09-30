import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import { ucfirst } from 'utils/string';
import { Icon } from 'components/Base';
import { getFilterObj } from 'utils';
import styles from './index.scss';

@translate()
export default class RepoList extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['repo', 'runtime']),
    topRepos: PropTypes.array,
    repos: PropTypes.array,
    runtimes: PropTypes.array,
    clusters: PropTypes.array,
    limit: PropTypes.number
  };

  static defaultProps = {
    type: 'public',
    topRepos: [],
    repos: [],
    runtimes: [],
    clusters: []
  };

  render() {
    const { topRepos, repos, runtimes, clusters, type, t } = this.props;
    let items = runtimes,
      totalName = 'Clusters';

    if (type === 'repo') {
      items = topRepos;
    }
    return (
      <Fragment>
        <ul className={classNames(styles.reposList)}>
          {items.map(item => {
            let link = `/dashboard/runtime/${item.runtime_id}`;
            let provider = item.provider;
            let number =
              clusters.filter(cluster => cluster.runtime_id === item.runtime_id).length || 0;

            let repo = getFilterObj(repos, 'repo_id', item.id);
            if (type === 'repo') {
              number = item.number;
              link = `/dashboard/repo/${item.id}`;
              provider = repo.providers && repo.providers[0];
            }

            return (
              <li key={item.id || item.runtime_id}>
                <Link to={link}>
                  <Icon
                    name={provider || 'stateful-set'}
                    size={24}
                    className={styles.icon}
                    type="dark"
                  />
                  <span className={styles.name}>{item.name || repo.name}</span>
                  <span className={styles.total}>
                    <span className={styles.number}>{number}</span>
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
