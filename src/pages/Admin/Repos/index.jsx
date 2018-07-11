import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { Icon, Button, Input, Modal } from 'components/Base';
import Layout, { Dialog } from 'components/Layout/Admin';
import RepoList from './RepoList';
import Loading from 'components/Loading';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  repoStore: rootStore.repoStore,
  appStore: rootStore.appStore
}))
@observer
export default class Repos extends Component {
  static async onEnter({ repoStore, appStore }) {
    await repoStore.fetchAll();
    await appStore.fetchApps({ status: ['active', 'deleted'] });
  }

  renderHandleMenu = id => {
    const { deleteRepoOpen } = this.props.repoStore;
    return (
      <div id={id} className="operate-menu">
        <Link to={`/dashboard/repo/${id}`}>View repo detail</Link>
        <Link to={`/dashboard/repo/edit/${id}`}>Modify repo</Link>
        <span onClick={() => deleteRepoOpen(id)}>Delete Repo</span>
      </div>
    );
  };

  deleteRepoModal = () => {
    const { showDeleteRepo, deleteRepoClose, deleteRepo } = this.props.repoStore;

    return (
      <Modal
        width={500}
        title="Delete Repo"
        visible={showDeleteRepo}
        hideFooter
        onCancel={deleteRepoClose}
      >
        <div className={styles.modalContent}>
          <div className={styles.noteWord}>Are you sure delete this Repo?</div>
          <div className={styles.operation}>
            <Button type="default" onClick={deleteRepoClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                deleteRepo(this.props.repoStore);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  render() {
    const { repoStore, appStore } = this.props;
    const {
      getRepoApps,
      repos,
      isLoading,
      fetchQueryRepos,
      searchWord,
      onClearSearch,
      onRefresh
    } = repoStore;
    const { apps } = appStore;
    const repoApps = getRepoApps(repos, apps);

    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.title}>Repos</div>

          <div className={styles.toolbar}>
            <Input.Search
              className={styles.search}
              placeholder="Search Repo Name"
              value={searchWord}
              onSearch={fetchQueryRepos}
              onClear={onClearSearch}
              maxlength="50"
            />
            <Link to="/dashboard/repo/create">
              <Button className={classNames(styles.buttonRight, styles.ml12)} type="primary">
                Create
              </Button>
            </Link>
            <Button className={styles.buttonRight} onClick={onRefresh}>
              <Icon name="refresh" />
            </Button>
          </div>
          <Loading className="loadTable" isLoading={isLoading}>
            <div>
              <RepoList visibility="public" repos={repoApps} actionMenu={this.renderHandleMenu} />
              <RepoList visibility="private" repos={repoApps} actionMenu={this.renderHandleMenu} />
            </div>
          </Loading>
        </div>
        {this.deleteRepoModal()}
      </Layout>
    );
  }
}
