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
    repos: PropTypes.array,
    type: PropTypes.oneOf(['public', 'private', 'runtime']),
    limit: PropTypes.number
  };

  static defaultProps = {
    limit: 2,
    type: 'public',
    repos: []
  };

  render() {
    const { repos, type, limit, t } = this.props;
    let filterRepos = repos,
      totalName = 'Clusters';

    if (type !== 'runtime') {
      filterRepos = repos.slice(0, limit).filter(repo => repo.visibility === type);
      totalName = 'Apps';
    }

    return (
      <Fragment>
        {type !== 'runtime' &&
          filterRepos.length > 0 && <div className={styles.type}>{t(ucfirst(type))}</div>}
        <ul className={classNames(styles.reposList, { [styles.reposBg]: type === 'private' })}>
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
                  {item.repo_id && (
                    <Icon
                      name={item.providers && item.providers[0]}
                      size={24}
                      className={styles.icon}
                      type="dark"
                    />
                  )}
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
