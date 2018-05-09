import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import Popover from 'components/Base/Popover';
import RepoCard from 'components/RepoCard';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  repoStore: rootStore.repoStore
}))
@observer
export default class Repos extends Component {
  static async onEnter({ repoStore }) {
    await repoStore.fetchRepos();
  }

  renderHandleMenu = id => (
    <div id={id} className="operate-menu">
      <Link to={`/manage/Repos/${id}`}>View repo detail</Link>
      <span>Delete Repo</span>
    </div>
  );

  render() {
    const { repoStore } = this.props;
    const repoList = toJS(repoStore.repos) || [];

    return (
      <div className={styles.repos}>
        <ManageTabs />
        <div className={styles.container}>
          <div className={styles.pageTitle}>Repos</div>
          <div className={styles.toolbar}>
            <Input.Search className={styles.search} placeholder="Search Repo Name" />
            <Button className={classNames(styles.buttonRight, styles.ml12)} type="primary">
              Create
            </Button>
            <Button className={styles.buttonRight}>
              <Icon name="refresh" />
            </Button>
          </div>
          <div className={styles.categories}>
            <div className={styles.line}>
              <div className={styles.word}>Public Repos ({repoList.length})</div>
            </div>
          </div>
          {repoList.map(repo => (
            <div className={styles.repoContent} key={repo.repo_id}>
              <RepoCard
                name={repo.name}
                description={repo.description}
                provider={repo.provider}
                imgArray={repo.imgArray}
                tags={repo.labels}
              />
              <div className={styles.handlePop}>
                <div>
                  <Popover content={this.renderHandleMenu(repo.repo_id)}>
                    <Icon name="more" />
                  </Popover>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
