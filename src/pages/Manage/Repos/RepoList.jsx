import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover } from 'components/Base';
import RepoCard from 'components/RepoCard';
import capitalize from 'lodash/capitalize';

import styles from './RepoList.scss';

const RepoList = ({ repos, visibility, actionMenu }) => {
  repos = repos.filter(repo => repo.visibility === visibility);

  return (
    <div className={styles.repoList}>
      <div className={styles.category}>
        <div className={styles.line}>
          <div className={styles.word}>
            {capitalize(visibility)} Repos ({repos.length})
          </div>
        </div>
      </div>
      {repos.length
        ? repos.map(({ repo_id, name, description, providers, images, labels }) => (
            <div className={styles.item} key={repo_id}>
              <RepoCard
                name={name}
                description={description}
                providers={providers}
                images={images}
                tags={labels}
              />
              <div className={styles.actionMenu}>
                <div>
                  <Popover content={actionMenu(repo_id)}>
                    <Icon name="more" />
                  </Popover>
                </div>
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

RepoList.propTypes = {
  repos: PropTypes.array.isRequired,
  visibility: PropTypes.string,
  actionMenu: PropTypes.func
};

RepoList.defaultProps = {
  repos: [],
  visibility: 'public',
  actionMenu: () => {}
};

export default RepoList;
