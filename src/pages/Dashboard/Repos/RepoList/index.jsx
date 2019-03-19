import React from 'react';
import PropTypes from 'prop-types';

import { Icon, Popover } from 'components/Base';
import capitalize from 'lodash/capitalize';
import { Translation } from 'react-i18next';
import RepoCard from '../RepoCard/index';

import styles from './index.scss';

const RepoList = ({ repos, visibility, actionMenu }) => {
  repos = repos.filter(repo => repo.visibility === visibility);

  return (
    <Translation>
      {t => (
        <div className={styles.repoList}>
          <div className={styles.category}>
            <div className={styles.line}>
              <div className={styles.word}>
                {`${t('repo_visible', {
                  visible: t(capitalize(visibility))
                })} (${repos.length})`}
              </div>
            </div>
          </div>
          {repos.map(
            ({
              repo_id,
              name,
              description,
              providers,
              apps,
              total,
              labels
            }) => (
              <div className={styles.item} key={repo_id}>
                <RepoCard
                  repoId={repo_id}
                  name={name}
                  description={description}
                  providers={providers.slice()}
                  apps={apps}
                  total={total}
                  tags={(labels && labels.slice()) || []}
                />
                <div className={styles.actionMenu}>
                  <Popover content={actionMenu(repo_id)} className="actions">
                    <Icon name="more" />
                  </Popover>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </Translation>
  );
};

RepoList.propTypes = {
  actionMenu: PropTypes.func,
  repos: PropTypes.array.isRequired,
  visibility: PropTypes.string
};

RepoList.defaultProps = {
  repos: [],
  visibility: 'public',
  actionMenu: () => {}
};

export default RepoList;
