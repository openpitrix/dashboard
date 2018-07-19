import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { Button, Modal } from 'components/Base';
import Layout from 'components/Layout';
import Toolbar from 'components/Toolbar';
import RepoList from './RepoList';
import Loading from 'components/Loading';

import styles from './index.scss';

@inject(({ rootStore, sock }) => ({
  rootStore,
  repoStore: rootStore.repoStore,
  appStore: rootStore.appStore,
  sock
}))
@observer
export default class Repos extends Component {
  static async onEnter({ repoStore, appStore }) {
    await repoStore.fetchAll();
    await appStore.fetchApps({ status: ['active', 'deleted'] });
  }

  constructor(props) {
    super(props);

    // listen to job, prevent event fire multiple times
    if (!props.sock._events['ops-resource']) {
      props.sock.on('ops-resource', this.listenToJob);
    }
  }

  listenToJob = payload => {
    const { rootStore } = this.props;

    if (['repo', 'repo_event'].includes(get(payload, 'resource.rtype'))) {
      // repo_event: create, update, delete
      rootStore.sockMessage = JSON.stringify(payload);
    }
  };

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

          <Toolbar
            placeholder="Search Repo Name"
            searchWord={searchWord}
            onSearch={fetchQueryRepos}
            onClear={onClearSearch}
            onRefresh={onRefresh}
            withCreateBtn={{ linkTo: `/dashboard/repo/create` }}
          />

          <Loading isLoading={isLoading}>
            <RepoList visibility="public" repos={repoApps} actionMenu={this.renderHandleMenu} />
            <RepoList visibility="private" repos={repoApps} actionMenu={this.renderHandleMenu} />
          </Loading>
        </div>
        {this.deleteRepoModal()}
      </Layout>
    );
  }
}
