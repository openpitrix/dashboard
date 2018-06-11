import React, { Component, Fragment } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { Icon, Button, Input, Modal } from 'components/Base';
import Layout from 'pages/Layout/Admin';
import RepoList from './RepoList';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  store: rootStore.repoStore,
  handleStore: rootStore.repoHandleStore
}))
@observer
export default class Repos extends Component {
  static async onEnter({ repoStore }) {
    await repoStore.fetchRepos();
  }

  onSearch = async value => {
    await this.props.store.fetchQueryRepos(value);
  };

  onRefresh = async () => {
    await this.onSearch();
  };

  renderHandleMenu = (id, status) => {
    const { deleteRepoOpen } = this.props.handleStore;
    return (
      <div id={id} className="operate-menu">
        <Link to={`/manage/repos/${id}`}>View repo detail</Link>
        {status !== 'deleted' && (
          <Fragment>
            <Link to={`/manage/repos/modify/${id}`}>Modify repo</Link>
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
    const { showDeleteRepo, deleteRepoClose, deleteRepo } = this.props.handleStore;

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
                  deleteRepo(this.props.store);
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

  render() {
    const { store } = this.props;
    const repoList = toJS(store.repos);

    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.title}>Repos</div>

          <div className={styles.toolbar}>
            <Input.Search
              className={styles.search}
              placeholder="Search Repo Name"
              onSearch={store.fetchQueryRepos}
            />
            <Link to="/manage/repos/create">
              <Button className={classNames(styles.buttonRight, styles.ml12)} type="primary">
                Create
              </Button>
            </Link>
            <Button className={styles.buttonRight} onClick={store.fetchRepos}>
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
