import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { capitalize } from 'lodash';
import { withTranslation } from 'react-i18next';

import { Icon } from 'components/Base';

import styles from './index.scss';

@withTranslation()
export default class RepoList extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    repos: PropTypes.array,
    type: PropTypes.oneOf(['public', 'private'])
  };

  static defaultProps = {
    type: 'public',
    repos: []
  };

  render() {
    const {
      repos, type, onChange, t
    } = this.props;

    return (
      <div
        className={classNames(styles.repoList, {
          [styles.publicBg]: type === 'private'
        })}
      >
        <div className={styles.title}>{t(capitalize(type))}</div>
        <ul>
          {repos.map(repo => (
            <li
              key={repo.repo_id}
              className={classNames({ [styles.active]: repo.active })}
              onClick={() => onChange(repo.repo_id)}
            >
              <Icon
                size={24}
                name={repo.providers && repo.providers[0]}
                type="dark"
              />
              <span className={styles.word}>{repo.name}</span>
            </li>
          ))}
        </ul>
        <div className={styles.explain}> * {t('diff_repo')}</div>
      </div>
    );
  }
}
