import React, { Component, Fragment } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { Icon, Button, Input, Modal } from 'components/Base';
import Layout, { Dialog } from 'components/Layout/Admin';
import RepoList from './RepoList';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  repoStore: rootStore.repoStore
}))
@observer
export default class Repos extends Component {
  static async onEnter({ repoStore }) {
    await repoStore.fetchAll();
  }

  onSearch = async value => {
    await this.props.repoStore.fetchQueryRepos(value);
  };

  onRefresh = async () => {
    await this.onSearch();
  };

  renderHandleMenu = (id, status) => {
    const { deleteRepoOpen } = this.props.repoStore;
    return (
      <div id={id} className="operate-menu">
        <Link to={`/dashboard/repos/${id}`}>View repo detail</Link>
        {status !== 'deleted' && (
          <Fragment>
            <Link to={`/dashboard/repo/edit/${id}`}>Modify repo</Link>
            <span
              onClick={() => {
                deleteRepoOpen(id);
              }}
            >
              Delete Repo
            </span>
          </Fragment>
        )}
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
            {status !== 'deleted' && (
              <Button
                type="primary"
                onClick={() => {
                  deleteRepo(this.props.repoStore);
                }}
              >
                Confirm
              </Button>
            )}
          </div>
        </div>
      </Modal>
    );
  };

  onSearch = e => {};

  onRefresh = e => {};

  render() {
    const { repoStore } = this.props;
    const repoList = toJS(repoStore.repos);

    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.title}>Repos</div>

          <div className={styles.toolbar}>
            <Input.Search
              className={styles.search}
              placeholder="Search Repo Name"
              onSearch={this.onSearch}
            />
            <Link to="/dashboard/repo/create">
              <Button className={classNames(styles.buttonRight, styles.ml12)} type="primary">
                Create
              </Button>
            </Link>
            <Button className={styles.buttonRight} onClick={this.onRefresh}>
              <Icon name="refresh" />
            </Button>
          </div>

          <RepoList visibility="public" repos={repoList} actionMenu={this.renderHandleMenu} />
          <RepoList visibility="private" repos={repoList} actionMenu={this.renderHandleMenu} />
        </div>
        {this.deleteRepoModal()}
      </Layout>
    );
  }
}
