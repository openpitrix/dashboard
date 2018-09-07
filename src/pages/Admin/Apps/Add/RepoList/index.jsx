import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { capitalize } from 'lodash';
import { translate } from 'react-i18next';

import { ucfirst } from 'utils/string';
import { Icon } from 'components/Base';

import styles from './index.scss';

@translate()
export default class RepoList extends PureComponent {
  static propTypes = {
    repos: PropTypes.array,
    type: PropTypes.oneOf(['public', 'private']),
    onChange: PropTypes.func
  };

  static defaultProps = {
    type: 'public',
    repos: []
  };

  render() {
    const { repos, type, onChange } = this.props;

    return (
      <div className={classNames(styles.repoList, { [styles.publicBg]: type === 'private' })}>
        <div className={styles.title}>{capitalize(type)}</div>
        <ul>
          {repos.map(repo => (
            <li
              key={repo.repo_id}
              className={classNames({ [styles.active]: repo.active })}
              onClick={() => onChange(repo.repo_id)}
            >
              <Icon size={24} name={repo.providers && repo.providers[0]} type="dark" />
              <span className={styles.word}>{repo.name}</span>
            </li>
          ))}
        </ul>
        <div className={styles.explain}> * Difference between public repo and private repo.</div>
      </div>
    );
  }
}
