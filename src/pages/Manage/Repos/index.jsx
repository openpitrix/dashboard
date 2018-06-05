import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { Icon, Button, Input } from 'components/Base';
import Layout from 'pages/Layout/Admin';
import RepoList from './RepoList';

import styles from './index.scss';

@inject(({ rootStore }) => ({
  store: rootStore.repoStore
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

  renderHandleMenu = id => (
    <div id={id} className="operate-menu">
      <Link to={`/manage/repos/${id}`}>View repo detail</Link>
      <span>Delete Repo</span>
    </div>
  );

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
              onSearch={this.onSearch}
            />
            <Link to="/manage/repos/create">
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
      </Layout>
    );
  }
}
